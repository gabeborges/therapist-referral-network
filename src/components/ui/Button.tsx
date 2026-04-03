import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "default" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-[0.01em] cursor-pointer font-[inherit] focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-brand-on border-none font-semibold transition-[background] duration-150 ease-out hover:bg-brand-h",
  secondary:
    "bg-transparent text-fg-2 border border-border transition-[border-color,color] duration-150 ease-out hover:border-border-e hover:text-fg",
};

const sizes: Record<ButtonSize, string> = {
  default: "h-11 px-6 text-[0.8125rem]",
  sm: "h-9 px-4 text-[0.8125rem]",
};

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}
