type BadgeVariant = "sent" | "responded" | "connected" | "closed";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  sent: "bg-inset text-fg-3",
  responded: "bg-brand-l text-brand",
  connected: "bg-ok-l text-ok",
  closed: "bg-inset text-fg-4",
};

export function Badge({ variant, children }: BadgeProps): React.ReactElement {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold tracking-[0.04em] uppercase ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
