import { PageHeader } from "@/components/layout/page-header";
import { PageShell } from "@/components/layout/page-shell";

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return <PageShell><PageHeader title={title} description={description} /></PageShell>;
}
