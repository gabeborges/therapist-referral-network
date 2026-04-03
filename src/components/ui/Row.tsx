import Link from "next/link";

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string;
  children: React.ReactNode;
}

const rowClasses =
  "flex items-center p-4 border-b border-border-s cursor-pointer transition-[background] duration-150 ease-out rounded-sm no-underline text-inherit hover:bg-s1 focus-visible:outline-2 focus-visible:outline-border-f focus-visible:outline-offset-[-2px]";

export function Row({ href, className = "", children, ...props }: RowProps): React.ReactElement {
  if (href) {
    return (
      <Link href={href} className={`${rowClasses} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <div className={`${rowClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
