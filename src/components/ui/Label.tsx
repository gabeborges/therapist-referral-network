interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  optional?: boolean;
}

export function Label({
  optional = false,
  className = "",
  children,
  ...props
}: LabelProps): React.ReactElement {
  return (
    <label
      className={`block mb-1 text-[0.8125rem] font-medium tracking-[0.01em] text-fg-2 ${className}`}
      {...props}
    >
      {children}
      {optional && <span className="font-normal text-fg-4"> (optional)</span>}
    </label>
  );
}
