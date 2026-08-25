import { FilingWizard } from "@/components/features/filing/filing-wizard";
import { PageHeader } from "@/components/layout/page-header";
import { PageShell } from "@/components/layout/page-shell";

export default function FileRtiPage() {
  return <PageShell><PageHeader title="File an RTI" description="A placeholder workflow foundation for a future guided filing experience." /><FilingWizard /></PageShell>;
}
