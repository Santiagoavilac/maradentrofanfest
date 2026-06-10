import { ArrowRight, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Layout from "../components/Layout";

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
        <div className="absolute inset-0 bg-[#101010]/28" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,12,18,0.74)_0%,rgba(5,12,18,0.42)_46%,rgba(5,12,18,0.16)_100%),linear-gradient(180deg,rgba(5,12,18,0.04)_0%,rgba(5,12,18,0.72)_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl content-center px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_0.75fr] lg:gap-16">
          <div className="max-w-3xl">
            <div className="mb-10 flex flex-wrap items-center gap-5">
              <img
                src="/mar-adentro-logo.jpg"
                alt="Mar Adentro"
                className="h-16 w-16 rounded-full object-cover ring-1 ring-white/28 sm:h-20 sm:w-20"
              />
              <span className="h-12 w-px bg-white/42" />
              <div className="flex items-center gap-4">
                <img
                  src="/el-arrecife-logo-cropped.jpg"
                  alt="El Arrecife"
                  className="h-14 w-auto bg-white/94 object-contain px-2 py-1 sm:h-16"
                />
                <p className="max-w-[12rem] text-xs font-semibold uppercase leading-5 tracking-[0.32em] text-white/82">
                  Anfitriones oficiales
                </p>
              </div>
            </div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.56em] text-[#d29a4a]">
              Fan Fest 2026
            </p>
            <h1 className="font-serif text-[3.45rem] font-normal uppercase leading-[0.92] tracking-[0.08em] text-white sm:text-[6.75rem]">
              El Mundial
              <span className="block">se vive</span>
            </h1>
            <p className="mt-6 font-serif text-2xl uppercase tracking-[0.28em] text-[#d29a4a] sm:text-4xl">
              en Mar Adentro
            </p>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/78 sm:text-lg">
              Mar Adentro y El Arrecife reciben el Fan Fest frente a la laguna. Reservá tu ingreso, guardá tu QR y presentalo en puerta.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/registro"
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 border border-white/72 bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#17130f] transition hover:bg-[#f3e9d9] sm:w-auto"
              >
                Reservar QR
                  <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="mt-10 grid content-center lg:mt-0">
            <article className="max-w-md border border-white/42 bg-white/[0.08] p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center border border-white/28 bg-white/10 text-[#d29a4a]">
                <Gamepad2 size={24} />
              </div>
              <h2 className="font-serif text-3xl font-normal uppercase tracking-[0.08em] sm:text-4xl">Jugá por premios</h2>
              <p className="mt-3 text-sm leading-6 text-white/74 sm:text-base">
                Podés ganar vales semanalmente de 100bs si aparecés en los rankings.
              </p>
              <a
                className="mt-5 inline-flex w-full sm:w-auto"
                href="https://maradentrogames.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                <Button className="w-full bg-white text-[#17130f] shadow-none hover:bg-[#f3e9d9] sm:w-auto">
                  Juega acá
                  <ArrowRight size={18} />
                </Button>
              </a>
            </article>
          </div>
        </div>
      </section>
    </Layout>
  );
}
