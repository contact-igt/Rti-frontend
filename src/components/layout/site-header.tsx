import Link from "next/link";
import { publicNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { MobileNav } from "@/components/layout/mobile-nav";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href={routes.home}>{siteConfig.name}</Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {publicNavigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <MobileNav items={publicNavigation} />
      </div>
    </header>
  );
}
