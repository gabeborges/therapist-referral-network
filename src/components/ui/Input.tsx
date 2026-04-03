import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error = false, className = "", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-[inherit] transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 disabled:opacity-50 disabled:cursor-not-allowed ${
        error ? "border-err" : "border-border"
      } ${className}`}
      {...props}
    />
  );
});
