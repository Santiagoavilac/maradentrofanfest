import { ArrowRight, Gift, MonitorPlay, Palmtree, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Layout from "../components/Layout";

const benefits = [
  { title: "Pantalla gigante", icon: <MonitorPlay size={22} /> },
  { title: "Juegos y dinámicas", icon: <Trophy size={22} /> },
  { title: "Premios", icon: <Gift size={22} /> },
  { title: "Frente a la laguna", icon: <Palmtree size={22} /> },
];

export default function Landing() {
  return (
    <Layout>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-deep">
        <video
          className="absolute inset-0 h-full w-full object-cover md:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/0609%20(1).mp4" type="video/mp4" />
        </video>
        <video
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/0609%20(1)(1).mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-deep/38" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(54,215,208,0.16),transparent_34%),linear-gradient(180deg,rgba(6,21,37,0.02)_0%,rgba(6,21,37,0.68)_88%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl content-center px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="max-w-2xl">
            <img
              src="/mar-adentro-logo.jpg"
              alt="Mar Adentro"
              className="mb-6 h-24 w-24 rounded-full object-cover shadow-glow ring-1 ring-white/20 sm:h-28 sm:w-28"
            />
            <h1 className="font-display text-5xl font-black leading-[0.95] text-white sm:text-7xl">
              Mar Adentro Fan Fest 2026
            </h1>
            <p className="mt-5 max-w-xl text-xl font-semibold text-lagoon sm:text-2xl">
              El Mundial se vive frente a la laguna.
            </p>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/74 sm:text-lg">
              Registrate, guardá tu QR y presentalo en el ingreso para vivir la experiencia Fan Fest de Mar Adentro.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/registro">
                <Button className="w-full sm:w-auto">
                  Generar mi QR
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-0">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="rounded-3xl border border-white/16 bg-white/[0.1] p-5 shadow-glow backdrop-blur-2xl">
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-lagoon/18 text-lagoon">
                  {benefit.icon}
                </div>
                <h2 className="text-xl font-extrabold">{benefit.title}</h2>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
