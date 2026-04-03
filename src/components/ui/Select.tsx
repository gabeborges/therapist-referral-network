import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const chevronBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238F8279' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { error = false, className = "", children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={`w-full h-11 px-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-[inherit] cursor-pointer appearance-none pr-9 transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        error ? "border-err" : "border-border"
      } ${className}`}
      style={{
        backgroundImage: chevronBg,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
      }}
      {...props}
    >
      {children}
    </select>
  );
});
