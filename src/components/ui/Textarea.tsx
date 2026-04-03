import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error = false, className = "", ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={`w-full min-h-[100px] p-3 bg-inset text-fg border rounded-sm text-[0.9375rem] font-[inherit] resize-y transition-[border-color,background,box-shadow] duration-150 ease-out focus:border-border-f focus:bg-bg focus:outline-2 focus:outline-border-f focus:outline-offset-2 placeholder:text-fg-4 disabled:opacity-50 disabled:cursor-not-allowed ${
        error ? "border-err" : "border-border"
      } ${className}`}
      {...props}
    />
  );
});
