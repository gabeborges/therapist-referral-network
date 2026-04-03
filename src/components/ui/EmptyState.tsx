interface EmptyStateProps {
  icon?: React.ReactNode;
  heading: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  heading,
  description,
  action,
}: EmptyStateProps): React.ReactElement {
  return (
    <div className="text-center py-16 px-4 max-w-[400px] mx-auto">
      {icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-l mb-5">
          {icon}
        </div>
      )}
      <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] leading-[1.35] text-fg mb-2">
        {heading}
      </h2>
      <p className="text-[0.9375rem] leading-[1.5] text-fg-2 mb-6">{description}</p>
      {action}
    </div>
  );
}
