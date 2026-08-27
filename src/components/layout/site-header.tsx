import Link from "next/link";
import { publicNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeaderSessionActions } from "@/components/layout/header-session-actions";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="service-strip">
        <div className="container service-strip__inner">
          <span>Citizen assistance for the Right to Information Act, 2005</span>
          <span>{siteConfig.disclaimer}</span>
        </div>
      </div>
      <div className="site-header__inner">
        <Link className="brand" href={routes.home} aria-label="RTI Saathi home">
          <span className="brand__mark" aria-hidden="true">RTI</span>
          <span className="brand__name">{siteConfig.name}</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {publicNavigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <HeaderSessionActions />
        </div>
        <MobileNav items={publicNavigation} />
      </div>
    </header>
  );
}
