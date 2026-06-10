import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";
import { createQrCode, storeRegistrationSnapshot } from "../lib/qr";
import { isSupabaseConfigured, Registration, supabase } from "../lib/supabase";

type FormState = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  document_id: string;
  companions: number;
  accepted: boolean;
};

const initialForm: FormState = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  document_id: "",
  companions: 0,
  accepted: false,
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: keyof FormState, value: string | number | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!form.first_name.trim() || !form.last_name.trim() || !form.phone.trim()) {
      setError("Nombre, apellido y teléfono son obligatorios.");
      return;
    }

    if (!form.accepted) {
      setError("Tenés que aceptar el registro para continuar.");
      return;
    }

    setLoading(true);
    const qr_code = createQrCode();

    try {
      if (!isSupabaseConfigured || !supabase) {
        const localRegistration = {
          id: crypto.randomUUID(),
          ...form,
          email: form.email || null,
          document_id: form.document_id || null,
          qr_code,
          guest_type: "regular",
          status: "registered",
          created_at: new Date().toISOString(),
          checked_in_at: null,
        } satisfies Registration & { accepted: boolean };
        storeRegistrationSnapshot(localRegistration);
        navigate(`/mi-qr/${localRegistration.id}`);
        return;
      }

      const { data, error: insertError } = await supabase
        .from("registrations")
        .insert({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          document_id: form.document_id.trim() || null,
          companions: form.companions,
          qr_code,
          guest_type: "regular",
        })
        .select()
        .single<Registration>();

      if (insertError) throw insertError;
      storeRegistrationSnapshot(data);
      navigate(`/mi-qr/${data.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h1 className="font-display text-4xl font-black leading-tight sm:text-6xl">Generá tu QR de ingreso</h1>
          <p className="mt-4 max-w-lg text-lg leading-8 text-white/70">
            Completá tus datos y guardá el QR para presentarlo en la puerta del Fan Fest.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/14 bg-white/[0.08] p-5 shadow-glow backdrop-blur-2xl sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nombre" value={form.first_name} onChange={(event) => update("first_name", event.target.value)} required />
            <Input label="Apellido" value={form.last_name} onChange={(event) => update("last_name", event.target.value)} required />
            <Input label="Teléfono" value={form.phone} onChange={(event) => update("phone", event.target.value)} required inputMode="tel" />
            <Input label="Email opcional" value={form.email} onChange={(event) => update("email", event.target.value)} type="email" />
            <Input label="Documento o CI opcional" value={form.document_id} onChange={(event) => update("document_id", event.target.value)} />
            <label className="grid gap-2 text-left">
              <span className="text-sm font-semibold text-white/82">Acompañantes</span>
              <select
                className="min-h-12 rounded-2xl border border-white/14 bg-white/[0.08] px-4 text-base text-white outline-none focus:border-lagoon"
                value={form.companions}
                onChange={(event) => update("companions", Number(event.target.value))}
              >
                <option className="bg-deep" value={0}>0</option>
                <option className="bg-deep" value={1}>1</option>
              </select>
            </label>
          </div>

          <label className="mt-5 flex items-start gap-3 rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-sm text-white/74">
            <input
              className="mt-1 h-5 w-5 accent-pitch"
              type="checkbox"
              checked={form.accepted}
              onChange={(event) => update("accepted", event.target.checked)}
            />
            Acepto registrarme para el Fan Fest de Mar Adentro
          </label>

          {error ? <p className="mt-4 rounded-2xl bg-red-500/16 px-4 py-3 text-sm text-red-100">{error}</p> : null}
          {!isSupabaseConfigured ? <p className="mt-4 rounded-2xl bg-sand/14 px-4 py-3 text-sm text-sand">Modo UI local: agregá las variables de Supabase para guardar registros reales.</p> : null}

          <Button className="mt-6 w-full" disabled={loading}>
            {loading ? "Generando..." : "Generar mi QR"}
          </Button>
        </form>
      </section>
    </Layout>
  );
}
