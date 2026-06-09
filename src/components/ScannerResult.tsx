import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

type ScannerResultProps = {
  type: "valid" | "used" | "invalid" | "idle";
  title: string;
  detail?: string;
};

const styles = {
  valid: "border-pitch/40 bg-pitch/16 text-pitch",
  used: "border-sand/40 bg-sand/16 text-sand",
  invalid: "border-red-400/40 bg-red-500/16 text-red-200",
  idle: "border-white/14 bg-white/[0.08] text-white/72",
};

const icons = {
  valid: <CheckCircle2 size={34} />,
  used: <AlertTriangle size={34} />,
  invalid: <XCircle size={34} />,
  idle: <AlertTriangle size={34} />,
};

export default function ScannerResult({ type, title, detail }: ScannerResultProps) {
  return (
    <div className={`rounded-3xl border p-6 text-center shadow-glow backdrop-blur-xl ${styles[type]}`}>
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10">
        {icons[type]}
      </div>
      <h2 className="font-display text-3xl font-black">{title}</h2>
      {detail ? <p className="mt-2 text-sm text-white/72">{detail}</p> : null}
    </div>
  );
}
