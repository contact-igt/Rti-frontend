import type { Metadata } from "next";
import { FilingShell } from "@/components/features/filing/filing-shell";

export const metadata: Metadata = {
  title: "Prepare an RTI Request",
  description: "Explain your issue, identify a likely Central public authority, prepare a clear RTI request and create a prototype RTI Saathi application.",
};

export default function StartPage() {
  return <FilingShell />;
}
