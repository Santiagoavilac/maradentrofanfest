import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin/dashboard", { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!supabase) {
      setError("Configurá Supabase para usar el admin real.");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate("/admin/dashboard");
  };

  return (
    <Layout>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-8">
        <form onSubmit={handleSubmit} className="w-full rounded-[2rem] border border-white/14 bg-white/[0.08] p-6 shadow-glow backdrop-blur-2xl">
          <h1 className="font-display text-4xl font-black">Admin Fan Fest</h1>
          <p className="mt-3 text-sm text-white/62">Ingresá con un usuario creado en Supabase Auth.</p>
          <div className="mt-6 grid gap-4">
            <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
            <Input label="Password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </div>
          {!isSupabaseConfigured ? <p className="mt-4 rounded-2xl bg-sand/14 px-4 py-3 text-sm text-sand">Faltan variables de Supabase.</p> : null}
          {error ? <p className="mt-4 rounded-2xl bg-red-500/16 px-4 py-3 text-sm text-red-100">{error}</p> : null}
          <Button className="mt-6 w-full" disabled={loading}>{loading ? "Ingresando..." : "Ingresar"}</Button>
        </form>
      </section>
    </Layout>
  );
}
