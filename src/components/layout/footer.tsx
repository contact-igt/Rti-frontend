import Link from "next/link";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <p className="footer-brand__name">{siteConfig.name}</p>
          <p>Clear guidance for a right that belongs to every Indian citizen.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href={routes.learn}>Understand RTI</Link>
          <Link href={routes.start}>Start an RTI</Link>
          <Link href={routes.track}>Track RTI</Link>
          <Link href={routes.applications}>My Applications</Link>
        </nav>
        <div className="footer-boundary">
          <p>{siteConfig.disclaimer}</p>
          <p>RTI Saathi offers assistance, not legal advice or guaranteed outcomes.</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.name}</span>
        <span>Made for citizens, in plain language.</span>
      </div>
    </footer>
  );
}
