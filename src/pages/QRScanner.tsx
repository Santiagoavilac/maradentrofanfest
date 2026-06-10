import { Html5Qrcode } from "html5-qrcode";
import { ArrowLeft, Camera, ScanLine, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Layout from "../components/Layout";
import ScannerResult from "../components/ScannerResult";
import { ScannerRpcResult, supabase } from "../lib/supabase";

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

type QRScannerProps = {
  publicAccess?: boolean;
};

export default function QRScanner({ publicAccess = false }: QRScannerProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const validatingRef = useRef(false);
  const [manualCode, setManualCode] = useState(searchParams.get("code") ?? "");
  const [result, setResult] = useState<ResultState>({ type: "idle", title: "Esperando QR", detail: "Abrí la cámara o pegá un código para validar." });
  const [cameraActive, setCameraActive] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const validateCode = useCallback(async (rawCode: string) => {
    if (validatingRef.current) return;
    validatingRef.current = true;
    const qr_code = cleanCode(rawCode);
    if (!qr_code) {
      validatingRef.current = false;
      return;
    }

    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop().catch(() => undefined);
      setCameraActive(false);
    }

    if (!supabase) {
      setResult({ type: "invalid", title: "Supabase no configurado", detail: "Agregá las variables de entorno para validar ingresos reales." });
      validatingRef.current = false;
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!publicAccess && !sessionData.session) {
      navigate("/admin", { replace: true });
      return;
    }

    const { data, error } = await supabase.rpc("scan_registration_qr", { input_code: qr_code });

    const rows = data as ScannerRpcResult[] | null;
    const scanned = rows?.[0];

    if (error || !scanned || scanned.result_type === "invalid") {
      setResult({ type: "invalid", title: "QR inválido", detail: qr_code });
      validatingRef.current = false;
      return;
    }

    const guestLabel = scanned.guest_type === "special" ? "Special guest" : "Asistente";
    const fullName = `${scanned.first_name ?? ""} ${scanned.last_name ?? ""}`.trim();

    if (scanned.result_type === "used") {
      setResult({
        type: "used",
        title: "QR ya utilizado",
        detail: `${guestLabel}: ${fullName}. Ingreso anterior: ${scanned.checked_in_at ? new Date(scanned.checked_in_at).toLocaleString() : "sin hora registrada"}.`,
      });
      validatingRef.current = false;
      return;
    }

    setResult({
      type: "valid",
      title: scanned.guest_type === "special" ? "Special guest válido" : "Ingreso válido",
      detail: fullName,
    });
    validatingRef.current = false;
  }, [navigate, publicAccess]);

  const startCamera = async () => {
    setCameraError("");
    setStartingCamera(true);
    validatingRef.current = false;
    setResult({ type: "idle", title: "Escaneando QR", detail: "Apuntá la cámara al QR de ingreso." });

    try {
      const scanner = scannerRef.current ?? new Html5Qrcode("qr-camera", { verbose: false });
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1,
        },
        (decodedText) => {
          validateCode(decodedText);
        },
        () => undefined,
      );
      setCameraActive(true);
    } catch (error) {
      setCameraError(error instanceof Error ? error.message : "No se pudo abrir la cámara.");
      setResult({ type: "invalid", title: "Cámara no disponible", detail: "Revisá permisos del navegador y volvé a intentar." });
    } finally {
      setStartingCamera(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop().catch(() => undefined);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (searchParams.get("code")) {
      validateCode(searchParams.get("code")!);
    }
  }, [searchParams, validateCode]);

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => undefined);
      }
      scannerRef.current?.clear();
    };
  }, []);

  return (
    <Layout>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.8fr]">
        <div>
          {!publicAccess ? (
            <Link to="/admin/dashboard" className="mb-4 inline-flex">
              <Button variant="ghost">
                <ArrowLeft size={18} />
                Dashboard
              </Button>
            </Link>
          ) : null}
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
            <div className="overflow-hidden rounded-3xl border border-white/12 bg-deep/70">
              <div id="qr-camera" className={`${cameraActive ? "min-h-[320px]" : "h-0"} overflow-hidden rounded-3xl`} />
              {!cameraActive ? (
                <div className="grid min-h-[320px] place-items-center px-5 py-8 text-center">
                  <div>
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-lagoon/14 text-lagoon">
                      <ScanLine size={34} />
                    </div>
                    <h2 className="font-display text-3xl font-black">Escanear QR</h2>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/64">
                      Tocá el botón, permití el acceso a la cámara y apuntá al QR.
                    </p>
                    <Button className="mt-6 w-full sm:w-auto" onClick={startCamera} disabled={startingCamera}>
                      <Camera size={18} />
                      {startingCamera ? "Abriendo cámara..." : "Abrir cámara"}
                    </Button>
                    {cameraError ? <p className="mt-4 text-xs text-red-200">{cameraError}</p> : null}
                  </div>
                </div>
              ) : (
                <div className="border-t border-white/10 p-4">
                  <Button className="w-full" variant="secondary" onClick={stopCamera}>
                    <Square size={16} />
                    Detener cámara
                  </Button>
                </div>
              )}
            </div>
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
