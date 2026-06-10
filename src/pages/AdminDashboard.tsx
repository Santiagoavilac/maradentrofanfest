import { Eye, LogOut, QrCode, Search, TicketCheck, UserPlus, Users, Waves } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";
import QRCard from "../components/QRCard";
import RegistrationTable from "../components/RegistrationTable";
import StatCard from "../components/StatCard";
import { createSpecialQrCode } from "../lib/qr";
import { Registration, supabase } from "../lib/supabase";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [specialForm, setSpecialForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [creatingSpecial, setCreatingSpecial] = useState(false);
  const [selectedSpecial, setSelectedSpecial] = useState<Registration | null>(null);

  const loadRegistrations = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setError("Configurá Supabase para cargar registros reales.");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      navigate("/admin", { replace: true });
      return;
    }

    const { data, error: loadError } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Registration[]>();

    if (loadError) setError(loadError.message);
    setRegistrations(data ?? []);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return registrations;

    return registrations.filter((registration) =>
      [
        registration.first_name,
        registration.last_name,
        registration.phone,
        registration.qr_code,
      ].some((value) => value.toLowerCase().includes(needle)),
    );
  }, [query, registrations]);

  const checkedIn = registrations.filter((registration) => registration.status === "checked_in").length;
  const pending = registrations.length - checkedIn;
  const regularRegistrations = filtered.filter((registration) => registration.guest_type !== "special");
  const specialGuests = filtered.filter((registration) => registration.guest_type === "special");

  const markCheckIn = async (registration: Registration) => {
    if (!supabase) return;

    const { error: updateError } = await supabase
      .from("registrations")
      .update({ status: "checked_in", checked_in_at: new Date().toISOString() })
      .eq("id", registration.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadRegistrations();
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
    navigate("/admin");
  };

  const createSpecialGuest = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!supabase) return;

    if (!specialForm.firstName.trim() || !specialForm.lastName.trim()) {
      setError("Nombre y apellido son obligatorios para special guest.");
      return;
    }

    setCreatingSpecial(true);
    const qrCode = createSpecialQrCode();
    const { data, error: createError } = await supabase
      .from("registrations")
      .insert({
        first_name: specialForm.firstName.trim(),
        last_name: specialForm.lastName.trim(),
        phone: specialForm.phone.trim() || "special guest",
        email: null,
        document_id: null,
        companions: 0,
        qr_code: qrCode,
        guest_type: "special",
      })
      .select()
      .single<Registration>();

    setCreatingSpecial(false);

    if (createError) {
      setError(createError.message);
      return;
    }

    setSpecialForm({ firstName: "", lastName: "", phone: "" });
    setSelectedSpecial(data);
    await loadRegistrations();
  };

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl font-black">Panel de ingresos</h1>
            <p className="mt-2 text-white/62">Control operativo de registros y validación en puerta.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/scanner">
              <Button>
                <QrCode size={18} />
                Scanner
              </Button>
            </Link>
            <Button variant="ghost" onClick={signOut}>
              <LogOut size={18} />
            </Button>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total registrados" value={registrations.length} icon={<Users size={22} />} />
          <StatCard label="Total ingresados" value={checkedIn} icon={<TicketCheck size={22} />} />
          <StatCard label="Total pendientes" value={pending} icon={<Waves size={22} />} />
        </div>

        <div className="mt-6 max-w-xl">
          <Input label="Buscar" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, teléfono o código QR" helper={<span className="inline-flex items-center gap-1"><Search size={14} /> Búsqueda local sobre los registros cargados</span>} />
        </div>

        {error ? <p className="mt-4 rounded-2xl bg-red-500/16 px-4 py-3 text-sm text-red-100">{error}</p> : null}
        <form onSubmit={createSpecialGuest} className="mt-6 rounded-3xl border border-white/12 bg-white/[0.08] p-5 shadow-glow backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-black">Reserva especial</h2>
              <p className="mt-1 text-sm text-white/60">Crea un QR marcado como special guest.</p>
            </div>
            <Button disabled={creatingSpecial}>
              <UserPlus size={18} />
              {creatingSpecial ? "Creando..." : "Crear special guest"}
            </Button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Input label="Nombre" value={specialForm.firstName} onChange={(event) => setSpecialForm((current) => ({ ...current, firstName: event.target.value }))} />
            <Input label="Apellido" value={specialForm.lastName} onChange={(event) => setSpecialForm((current) => ({ ...current, lastName: event.target.value }))} />
            <Input label="Teléfono opcional" value={specialForm.phone} onChange={(event) => setSpecialForm((current) => ({ ...current, phone: event.target.value }))} />
          </div>
        </form>

        {selectedSpecial ? (
          <div className="mt-6 rounded-3xl border border-sand/28 bg-sand/10 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sand">Special guest creado</p>
                <h2 className="mt-1 text-xl font-black">{selectedSpecial.first_name} {selectedSpecial.last_name}</h2>
              </div>
              <Button variant="secondary" onClick={() => setSelectedSpecial(null)}>Cerrar QR</Button>
            </div>
            <div className="mt-5">
              <QRCard value={selectedSpecial.qr_code} name={`${selectedSpecial.first_name} ${selectedSpecial.last_name}`} label="SPECIAL GUEST" />
            </div>
          </div>
        ) : null}

        {loading ? (
          <p className="mt-8 text-white/62">Cargando registros...</p>
        ) : (
          <>
            <section className="mt-6">
              <h2 className="mb-3 font-display text-2xl font-black">Registros generales</h2>
              <RegistrationTable registrations={regularRegistrations} onCheckIn={markCheckIn} />
            </section>
            <section className="mt-8">
              <h2 className="mb-3 font-display text-2xl font-black">Special guests</h2>
              <div className="overflow-hidden rounded-3xl border border-white/12 bg-white/[0.07] backdrop-blur-xl">
                <div className="overflow-x-auto">
                  <table className="min-w-[720px] w-full text-left text-sm">
                    <thead className="border-b border-white/10 bg-white/[0.08] text-xs uppercase tracking-[0.12em] text-white/56">
                      <tr>
                        <th className="px-4 py-4">Nombre</th>
                        <th className="px-4 py-4">Teléfono</th>
                        <th className="px-4 py-4">Estado</th>
                        <th className="px-4 py-4">Código</th>
                        <th className="px-4 py-4">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {specialGuests.map((guest) => (
                        <tr key={guest.id} className="border-b border-white/8 last:border-none">
                          <td className="px-4 py-4 font-semibold">{guest.first_name} {guest.last_name}</td>
                          <td className="px-4 py-4 text-white/72">{guest.phone}</td>
                          <td className="px-4 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${guest.status === "checked_in" ? "bg-pitch/18 text-pitch" : "bg-sand/18 text-sand"}`}>
                              {guest.status === "checked_in" ? "Ingresado" : "Pendiente"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-white/62">{guest.qr_code}</td>
                          <td className="px-4 py-4">
                            <Button className="min-h-10 px-4 py-2 text-xs" variant="secondary" onClick={() => setSelectedSpecial(guest)}>
                              <Eye size={16} />
                              Ver QR
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {specialGuests.length === 0 ? <p className="px-5 py-8 text-center text-white/58">Sin special guests.</p> : null}
              </div>
            </section>
          </>
        )}
      </section>
    </Layout>
  );
}
