import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: number;
  icon: ReactNode;
};

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-white/12 bg-white/[0.08] p-5 shadow-glow backdrop-blur-xl">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 text-lagoon">
        {icon}
      </div>
      <p className="font-display text-4xl font-black">{value}</p>
      <p className="mt-1 text-sm text-white/62">{label}</p>
    </article>
  );
}
