import { ApplicationDetailPlaceholder } from "@/components/features/applications/application-detail-placeholder";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ApplicationDetailPlaceholder id={id} />;
}
