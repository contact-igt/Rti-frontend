"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { useDemoSession } from "@/lib/auth/use-session";

export function HeaderSessionActions() {
  const session = useDemoSession();
  const router = useRouter();
  if (session.status === "loading") return <span className="session-actions-placeholder" aria-hidden="true" />;
  if (session.status !== "authenticated") return <><Link className="login-link" href={routes.login}>Log in</Link><Link className="button button--primary" href={routes.start}>Start an RTI</Link></>;
  return <><Link className="login-link" href={routes.applications}>My applications</Link><button className="header-logout" type="button" onClick={async () => { await session.logout(); router.replace(routes.home); router.refresh(); }}>Log out</button><Link className="button button--primary" href={routes.start}>Start an RTI</Link></>;
}
