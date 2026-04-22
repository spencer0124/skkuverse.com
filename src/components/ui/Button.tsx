import { cn } from "@/lib/cn";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  href?: string;
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-bold rounded-full transition-all";
  const variants = {
    primary: "bg-brand text-white hover:bg-brand/90",
    secondary: "bg-grey-100 text-grey-800 hover:bg-grey-200",
  };
  const sizes = {
    md: "px-6 py-3 text-t6",
    lg: "px-8 py-4 text-t5",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
