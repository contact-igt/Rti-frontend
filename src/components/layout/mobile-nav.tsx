"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavigationItem } from "@/config/navigation";

export function MobileNav({ items }: { items: readonly NavigationItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-nav">
      <button aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} type="button">
        Menu
      </button>
      {open ? (
        <nav id="mobile-navigation" aria-label="Mobile navigation">
          {items.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
        </nav>
      ) : null}
    </div>
  );
}
