import { ApplicationDetailScreen } from "@/components/features/applications/application-detail-screen";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ApplicationDetailScreen id={id} />;
}
