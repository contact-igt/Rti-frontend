import { CheckCircle2 } from "lucide-react";
import { formatDate, statusLabel } from "@/lib/applications/presentation";
import type { ApplicationTimelineEvent } from "@/types/filing";

export function ApplicationTimeline({ events }: { events: ApplicationTimelineEvent[] }) {
  const ordered = [...events].sort((left, right) => Date.parse(left.occurredAt) - Date.parse(right.occurredAt));
  return <ol className="case-timeline">{ordered.map((event) => <li key={event.id}><span className="case-timeline__marker"><CheckCircle2 aria-hidden="true" /></span><div><div><strong>{event.title}</strong><span>{statusLabel(event.status)}</span></div><p>{event.description}</p><time dateTime={event.occurredAt}>{formatDate(event.occurredAt, true)}</time></div></li>)}</ol>;
}
