import type { ApplicationStatus } from "@/types/filing";
import type { FirstAppealGuidance, ReplyAnalysis } from "@/types/filing";

const labels: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  received: "Received by authority",
  transferred: "Transferred",
  in_progress: "Being processed",
  response_received: "Response received",
  action_required: "Your attention is needed",
  completed: "Completed",
};

export function statusLabel(status: ApplicationStatus) {
  return labels[status];
}

export function formatDate(value: string, withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "Date unavailable";
  return date.toLocaleString("en-IN", withTime ? { dateStyle: "long", timeStyle: "short" } : { dateStyle: "long" });
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function maskEmail(value: string | null) {
  if (!value) return "Not provided";
  const [name, domain] = value.split("@");
  if (!domain) return "Provided";
  return `${name.slice(0, 1)}${"•".repeat(Math.min(5, Math.max(2, name.length - 1)))}@${domain}`;
}

export function maskPhone(value: string | null) {
  if (!value) return "Not provided";
  return `••••••${value.slice(-4)}`;
}

const assessmentLabels: Record<ReplyAnalysis["overallStatus"], string> = {
  answered: "Answered",
  partially_answered: "Partly answered",
  not_answered: "Not answered",
  unclear: "Unclear",
};

export function assessmentLabel(status: ReplyAnalysis["overallStatus"]) {
  return assessmentLabels[status];
}

const overallMessages: Record<ReplyAnalysis["overallStatus"], string> = {
  answered: "The reply appears to address your request.",
  partially_answered: "Some parts were answered, but information may still be missing.",
  not_answered: "The reply does not appear to answer the information you requested.",
  unclear: "It is not clear whether the requested information was fully provided.",
};

export function overallUnderstanding(status: ReplyAnalysis["overallStatus"]) {
  return overallMessages[status];
}

const guidanceLabels: Record<FirstAppealGuidance["status"], string> = {
  not_yet_due: "A first appeal may be premature right now.",
  may_consider: "You may want to review whether a first appeal is appropriate.",
  recommended: "Based on this RTI Saathi record, you may consider a first appeal.",
  not_currently_recommended: "The recorded reply appears substantially complete.",
};

export function guidanceLabel(status: FirstAppealGuidance["status"]) {
  return guidanceLabels[status];
}
