import { PlaceholderPage } from "@/components/shared/placeholder-page";

export function ApplicationDetailPlaceholder({ id }: { id: string }) {
  return <PlaceholderPage title="Application detail" description={`Placeholder for application ${id}.`} />;
}
