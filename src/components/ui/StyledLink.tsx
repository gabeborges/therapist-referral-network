import Link from "next/link";

interface StyledLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}

export function StyledLink({
  href,
  external = false,
  className = "",
  children,
  ...props
}: StyledLinkProps): React.ReactElement {
  const classes = `text-brand font-medium no-underline hover:underline focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-2 rounded-[4px] ${className}`;

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
