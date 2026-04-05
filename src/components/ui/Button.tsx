import { type ButtonHTMLAttributes } from "react";
import { Spinner } from "@/components/ui/Spinner";

type ButtonVariant = "primary" | "secondary" | "google" | "text" | "danger";
type ButtonSize = "default" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-[0.01em] cursor-pointer font-[inherit] focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-brand-on border-none font-semibold transition-[background] duration-150 ease-out hover:bg-brand-h",
  secondary:
    "bg-transparent text-fg-2 border border-border transition-[border-color,color] duration-150 ease-out hover:border-border-e hover:text-fg",
  google:
    "w-full bg-s2 text-fg border border-border text-[0.9375rem] font-medium gap-3 transition-[border-color,box-shadow] duration-150 ease-out hover:border-border-e hover:shadow-1",
  text: "bg-transparent border-none text-fg-2 text-[0.8125rem] font-medium p-0 transition-[color] duration-150 hover:text-fg",
  danger:
    "bg-err text-white border-none font-semibold transition-[background] duration-150 ease-out hover:bg-err-h",
};

const sizeClasses: Record<ButtonVariant, Record<ButtonSize, string>> = {
  primary: { default: "h-11 px-6 text-[0.8125rem]", sm: "h-9 px-4 text-[0.8125rem]" },
  secondary: { default: "h-11 px-6 text-[0.8125rem]", sm: "h-9 px-4 text-[0.8125rem]" },
  google: { default: "h-12 px-6", sm: "h-10 px-4" },
  text: { default: "", sm: "" },
  danger: { default: "h-11 px-6 text-[0.8125rem]", sm: "h-9 px-4 text-[0.8125rem]" },
};

export function Button({
  variant = "primary",
  size = "default",
  loading = false,
  icon,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps): React.ReactElement {
  const spinnerVariant =
    variant === "primary" || variant === "google" || variant === "danger" ? "white" : "brand";

  return (
    <button
      className={`${base} ${variantClasses[variant]} ${sizeClasses[variant][size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner variant={spinnerVariant} size={16} /> : icon}
      {children}
    </button>
  );
}
