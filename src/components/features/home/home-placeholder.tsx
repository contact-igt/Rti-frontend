import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/layout/page-header";
import { PageShell } from "@/components/layout/page-shell";
import { routes } from "@/config/routes";

export function HomePlaceholder() {
  return <PageShell><PageHeader title="RTI Saathi" description="A structured starting point for citizen RTI journeys." /><ButtonLink href={routes.fileRti}>Start an RTI</ButtonLink></PageShell>;
}
