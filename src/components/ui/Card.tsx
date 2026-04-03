interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className = "", children, ...props }: CardProps): React.ReactElement {
  return (
    <div className={`bg-s1 border border-border rounded-md shadow-1 ${className}`} {...props}>
      {children}
    </div>
  );
}
