import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helper?: ReactNode;
};

export default function Input({ label, helper, className = "", ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-left">
      <span className="text-sm font-semibold text-white/82">{label}</span>
      <input
        className={`min-h-12 rounded-2xl border border-white/14 bg-white/[0.08] px-4 text-base text-white outline-none transition placeholder:text-white/36 focus:border-lagoon focus:bg-white/[0.12] ${className}`}
        {...props}
      />
      {helper ? <span className="text-xs text-white/52">{helper}</span> : null}
    </label>
  );
}
