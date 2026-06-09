import { Html5QrcodeScanner } from "html5-qrcode";
import { ArrowLeft, Camera } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Layout from "../components/Layout";
import ScannerResult from "../components/ScannerResult";
import { Registration, supabase } from "../lib/supabase";

type ResultState = {
  type: "valid" | "used" | "invalid" | "idle";
  title: string;
  detail?: string;
};

function cleanCode(raw: string) {
  try {
    const url = new URL(raw);
    return url.searchParams.get("code") ?? raw;
  } catch {
    return raw.trim();
  }
}

export default function QRScanner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [manualCode, setManualCode] = useState(searchParams.get("code") ?? "");
  const [result, setResult] = useState<ResultState>({ type: "idle", title: "Esperando QR", detail: "Abrí la cámara o pegá un código para validar." });

  const validateCode = useCallback(async (rawCode: string) => {
    const qr_code = cleanCode(rawCode);
    if (!qr_code) return;

    if (!supabase) {
      setResult({ type: "invalid", title: "Supabase no configurado", detail: "Agregá las variables de entorno para validar ingresos reales." });
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      navigate("/admin", { replace: true });
      return;
    }

    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("qr_code", qr_code)
      .maybeSingle<Registration>();

    if (error || !data) {
      setResult({ type: "invalid", title: "QR inválido", detail: qr_code });
      return;
    }

    if (data.status === "checked_in") {
      setResult({
        type: "used",
        title: "QR ya utilizado",
        detail: `${data.first_name} ${data.last_name} ingresó ${data.checked_in_at ? new Date(data.checked_in_at).toLocaleString() : "anteriormente"}.`,
      });
      return;
    }

    const checkedInAt = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("registrations")
      .update({ status: "checked_in", checked_in_at: checkedInAt })
      .eq("id", data.id);

    if (updateError) {
      setResult({ type: "invalid", title: "No se pudo marcar ingreso", detail: updateError.message });
      return;
    }

    setResult({
      type: "valid",
      title: "Ingreso válido",
      detail: `${data.first_name} ${data.last_name}`,
    });
  }, [navigate]);

  useEffect(() => {
    if (searchParams.get("code")) {
      validateCode(searchParams.get("code")!);
    }
  }, [searchParams, validateCode]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true },
      false,
    );
    scannerRef.current = scanner;
    scanner.render(
      (decodedText) => {
        validateCode(decodedText);
      },
      () => undefined,
    );

    return () => {
      scannerRef.current?.clear().catch(() => undefined);
    };
  }, [validateCode]);

  return (
    <Layout>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <Link to="/admin/dashboard" className="mb-4 inline-flex">
            <Button variant="ghost">
              <ArrowLeft size={18} />
              Dashboard
            </Button>
          </Link>
          <div className="rounded-[2rem] border border-white/14 bg-white/[0.08] p-4 shadow-glow backdrop-blur-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lagoon/16 text-lagoon">
                <Camera size={22} />
              </div>
              <div>
                <h1 className="font-display text-3xl font-black">Scanner QR</h1>
                <p className="text-sm text-white/60">Pensado para celular en puerta.</p>
              </div>
            </div>
            <div id="qr-reader" className="overflow-hidden rounded-3xl bg-white text-deep" />
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <ScannerResult {...result} />
          <form
            className="rounded-3xl border border-white/12 bg-white/[0.08] p-4 backdrop-blur-xl"
            onSubmit={(event) => {
              event.preventDefault();
              validateCode(manualCode);
            }}
          >
            <label className="grid gap-2 text-sm font-semibold text-white/72">
              Código QR
              <input
                className="min-h-12 rounded-2xl border border-white/14 bg-white/[0.08] px-4 text-base text-white outline-none focus:border-lagoon"
                value={manualCode}
                onChange={(event) => setManualCode(event.target.value)}
                placeholder="MA-2026-XXXXXXXX"
              />
            </label>
            <Button className="mt-4 w-full" type="submit">Validar código</Button>
          </form>
        </aside>
      </section>
    </Layout>
  );
}
