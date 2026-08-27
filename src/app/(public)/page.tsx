import type { Metadata } from "next";
import { HomePage } from "@/components/features/home/home-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "RTI Saathi — Understand, Prepare and Track RTI Requests",
  description: siteConfig.description,
};

export default function Page() {
  return <HomePage />;
}
