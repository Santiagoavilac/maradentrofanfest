import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variants = {
  primary: "bg-pitch text-deep shadow-gold hover:bg-sand",
  secondary: "bg-white/12 text-white ring-1 ring-white/20 hover:bg-white/18",
  danger: "bg-red-500 text-white hover:bg-red-400",
  ghost: "bg-transparent text-white/80 hover:bg-white/10",
};

export default function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
