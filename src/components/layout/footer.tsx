import { siteConfig } from "@/config/site";

export function Footer() {
  return <footer className="site-footer">© {new Date().getFullYear()} {siteConfig.name}</footer>;
}
