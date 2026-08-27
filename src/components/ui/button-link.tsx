import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "text";
};

export function ButtonLink({ className = "", variant = "primary", ...props }: ButtonLinkProps) {
  return <Link className={`button button--${variant} ${className}`.trim()} {...props} />;
}
