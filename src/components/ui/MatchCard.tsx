type MatchCardVariant = "accepted" | "declined" | "pending";

interface MatchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: MatchCardVariant;
  children: React.ReactNode;
}

const variantClasses: Record<MatchCardVariant, string> = {
  accepted: "border-l-[3px] border-l-ok",
  declined: "border-l-[3px] border-l-err opacity-[0.65]",
  pending: "border-l-[3px] border-l-border",
};

export function MatchCard({
  variant,
  className = "",
  children,
  ...props
}: MatchCardProps): React.ReactElement {
  return (
    <div
      className={`bg-s1 border border-border rounded-md shadow-1 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
