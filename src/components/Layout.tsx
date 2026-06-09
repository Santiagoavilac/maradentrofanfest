import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-deep text-white">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_15%_0%,rgba(54,215,208,0.25),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(244,201,103,0.18),transparent_32%),linear-gradient(180deg,#07182a_0%,#061525_45%,#04101c_100%)]" />
      <div className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-deep/58 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 text-white">
            <img
              src="/mar-adentro-logo.jpg"
              alt="Mar Adentro"
              className="h-10 w-10 rounded-full object-cover ring-1 ring-white/18"
            />
            <span className="font-display text-sm font-black uppercase tracking-[0.18em]">
              Mar Adentro
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold text-white/76">
            <Link className="rounded-full px-3 py-2 hover:bg-white/10" to="/registro">
              Registro
            </Link>
          </div>
        </nav>
      </div>
      <main className="pt-16">{children}</main>
    </div>
  );
}
