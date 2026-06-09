import { LogOut, QrCode, Search, TicketCheck, Users, Waves } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";
import RegistrationTable from "../components/RegistrationTable";
import StatCard from "../components/StatCard";
import { Registration, supabase } from "../lib/supabase";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
        {loading ? <p className="mt-8 text-white/62">Cargando registros...</p> : <div className="mt-6"><RegistrationTable registrations={filtered} onCheckIn={markCheckIn} /></div>}
      </section>
    </Layout>
  );
}
