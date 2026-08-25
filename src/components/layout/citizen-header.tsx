import Link from "next/link";
import { citizenNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { MobileNav } from "@/components/layout/mobile-nav";

export function CitizenHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href={routes.home}>{siteConfig.name}</Link>
        <nav className="desktop-nav" aria-label="Citizen navigation">
          {citizenNavigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <MobileNav items={citizenNavigation} />
      </div>
    </header>
  );
}
