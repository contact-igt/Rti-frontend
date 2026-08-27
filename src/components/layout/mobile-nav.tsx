"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavigationItem } from "@/config/navigation";
import { routes } from "@/config/routes";
import { Menu, X } from "lucide-react";
import { useDemoSession } from "@/lib/auth/use-session";
import { useRouter } from "next/navigation";

export function MobileNav({ items }: { items: readonly NavigationItem[] }) {
  const [open, setOpen] = useState(false);
  const session = useDemoSession();
  const router = useRouter();
  return (
    <div className={`mobile-nav${open ? " mobile-nav--open" : ""}`}>
      <button className="mobile-nav__trigger" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)} type="button">
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        <span>Menu</span>
      </button>
      {open ? (
        <nav id="mobile-navigation" aria-label="Mobile navigation">
          {items.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
          <div className="mobile-nav__actions">
            {session.status === "authenticated" ? <><Link href={routes.applications} onClick={() => setOpen(false)}>My applications</Link><button type="button" onClick={async () => { setOpen(false); await session.logout(); router.replace(routes.home); }}>Log out</button></> : <Link href={routes.login} onClick={() => setOpen(false)}>Log in</Link>}
            <Link className="button button--primary" href={routes.start} onClick={() => setOpen(false)}>Start an RTI</Link>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
