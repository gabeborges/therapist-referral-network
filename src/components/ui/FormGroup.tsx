interface FormGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function FormGroup({ title, description, children }: FormGroupProps): React.ReactElement {
  return (
    <div className="border-t border-border-s pt-6">
      <fieldset className="border-none p-0 m-0">
        <legend className="text-[1rem] font-semibold tracking-[-0.005em] text-fg">{title}</legend>
        {description && <p className="text-[0.875rem] text-fg-3 mt-1">{description}</p>}
        <div className="mt-4 space-y-6">{children}</div>
      </fieldset>
    </div>
  );
}
