import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="min-h-screen overflow-hidden bg-[#f6efe6] text-[#1d1a17]">
      <div className="fixed inset-x-0 top-0 z-40 border-b border-[#1d1a17]/10 bg-[#fbf7f1]/86 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 text-[#1d1a17]">
            <span className="flex items-center -space-x-2">
              <img
                src="/mar-adentro-logo.jpg"
                alt="Mar Adentro"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#fbf7f1]"
              />
              <img
                src="/el-arrecife-logo.jpg"
                alt="El Arrecife"
                className="h-10 w-14 bg-[#fbf7f1] object-contain ring-2 ring-[#fbf7f1]"
              />
            </span>
            <span className="font-serif text-sm uppercase tracking-[0.18em]">
              Mar Adentro x El Arrecife
            </span>
          </Link>
          <span className="text-sm font-semibold text-[#6a5d50]">Registro</span>
        </nav>
      </div>
      <main className="pt-16">
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#f6efe6] text-[#1d1a17] [color-scheme:light]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.96)_0%,rgba(246,239,230,0.88)_38%,rgba(217,196,171,0.38)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(246,239,230,0)_0%,rgba(188,155,119,0.18)_100%)]" />

        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-12">
          <div className="flex min-h-[34rem] flex-col justify-center text-center lg:text-left">
            <div className="mx-auto w-fit border-x-2 border-t-2 border-[#1d1a17] px-7 pt-4 lg:mx-0">
              <div className="mx-auto flex items-center justify-center gap-4">
                <img
                  src="/mar-adentro-logo.jpg"
                  alt="Mar Adentro"
                  className="h-20 w-20 rounded-full object-cover shadow-[0_14px_34px_rgba(29,26,23,0.12)]"
                />
                <img
                  src="/el-arrecife-logo.jpg"
                  alt="El Arrecife"
                  className="h-24 w-36 object-contain"
                />
              </div>
              <div className="mt-3 border-b-2 border-[#1d1a17] pb-4">
                <p className="font-serif text-2xl font-normal uppercase tracking-[0.08em] text-[#1d1a17] sm:text-3xl">Mar Adentro x El Arrecife</p>
              </div>
            </div>

            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.62em] text-[#9b6b2f] sm:text-sm">
              Tu acceso te espera
            </p>
            <div className="mx-auto mt-7 h-px w-12 bg-[#c17b2c] lg:mx-0" />
            <h1 className="mt-8 font-serif text-[3.25rem] font-normal uppercase leading-[0.96] tracking-[0.08em] text-[#24211d] sm:text-[5.7rem] lg:text-[6.5rem]">
              Reserva
              <span className="block">Fan Fest</span>
            </h1>
            <p className="mt-4 font-serif text-3xl uppercase tracking-[0.34em] text-[#c17b2c] sm:text-4xl">
              Mar Adentro
            </p>

            <div className="mt-10 grid gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#2d2924] sm:grid-cols-3 sm:items-center">
              <span>Fan Fest 2026</span>
              <span className="hidden h-10 w-px justify-self-center bg-[#c17b2c]/70 sm:block" />
              <span>Anfitriones: Mar Adentro y El Arrecife</span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="self-center border border-[#2a251f]/18 bg-white/76 p-5 shadow-[0_30px_90px_rgba(73,55,34,0.16)] backdrop-blur-xl sm:p-7 lg:p-8"
          >
            <div className="border border-[#2a251f]/14 p-5 sm:p-6">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.42em] text-[#b87729]">Registro de ingreso</p>
                <h2 className="mt-4 font-serif text-4xl uppercase tracking-[0.1em] text-[#1f1b17] sm:text-[2.85rem]">Generá tu QR</h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#62574d]">
                  Completá tus datos y guardá el código para presentarlo en puerta.
                </p>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <Field label="Nombre">
                  <input value={form.first_name} onChange={(event) => update("first_name", event.target.value)} required />
                </Field>
                <Field label="Apellido">
                  <input value={form.last_name} onChange={(event) => update("last_name", event.target.value)} required />
                </Field>
                <Field label="Teléfono">
                  <input value={form.phone} onChange={(event) => update("phone", event.target.value)} required inputMode="tel" />
                </Field>
                <Field label="Email opcional">
                  <input value={form.email} onChange={(event) => update("email", event.target.value)} type="email" />
                </Field>
                <Field label="Documento o CI opcional">
                  <input value={form.document_id} onChange={(event) => update("document_id", event.target.value)} />
                </Field>
                <Field label="Acompañantes">
                  <select value={form.companions} onChange={(event) => update("companions", Number(event.target.value))}>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                  </select>
                </Field>
              </div>

              <label className="mt-5 flex items-start gap-3 border border-[#2a251f]/14 bg-[#f5eadc]/70 p-4 text-sm leading-6 text-[#62574d]">
                <input
                  className="mt-1 h-5 w-5 accent-[#c17b2c]"
                  type="checkbox"
                  checked={form.accepted}
                  onChange={(event) => update("accepted", event.target.checked)}
                />
                Acepto registrarme para el Fan Fest de Mar Adentro y El Arrecife.
              </label>

              {error ? <p className="mt-4 bg-red-100 px-4 py-3 text-sm font-semibold text-red-800">{error}</p> : null}
              {!isSupabaseConfigured ? <p className="mt-4 bg-[#f0dfc7] px-4 py-3 text-sm font-semibold text-[#8a5a1f]">Modo UI local: agregá las variables de Supabase para guardar registros reales.</p> : null}

              <button
                className="mt-6 flex min-h-12 w-full items-center justify-center bg-[#1f1b17] px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white transition hover:bg-[#c17b2c] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Generando..." : "Generar mi QR"}
              </button>
            </div>
          </form>
        </div>
      </section>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactElement }) {
  return (
    <label className="grid gap-2 text-left">
      <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#7b6c5e]">{label}</span>
      <div className="[&_input]:min-h-12 [&_input]:w-full [&_input]:appearance-none [&_input]:border [&_input]:border-[#2a251f]/16 [&_input]:bg-white/82 [&_input]:px-4 [&_input]:text-base [&_input]:text-[#1f1b17] [&_input]:outline-none [&_input]:transition [&_input]:focus:border-[#c17b2c] [&_input]:focus:bg-white [&_select]:min-h-12 [&_select]:w-full [&_select]:border [&_select]:border-[#2a251f]/16 [&_select]:bg-white/82 [&_select]:px-4 [&_select]:text-base [&_select]:text-[#1f1b17] [&_select]:outline-none [&_select]:transition [&_select]:focus:border-[#c17b2c] [&_select]:focus:bg-white">
        {children}
      </div>
    </label>
  );
}
