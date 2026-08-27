import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "RTI Saathi — Understand, Prepare and Track RTI Requests",
    template: "%s | RTI Saathi",
  },
  description: siteConfig.description,
  openGraph: {
    title: "RTI Saathi — Understand, Prepare and Track RTI Requests",
    description: siteConfig.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RTI Saathi — Understand, Prepare and Track RTI Requests",
    description: siteConfig.description,
  },
};

export const viewport = {
  themeColor: "#f4f0e6",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
        <Footer />
      </body>
    </html>
  );
}
