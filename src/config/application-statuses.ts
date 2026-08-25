import type { ApplicationStatus } from "@/types";

export const applicationStatuses: readonly ApplicationStatus[] = [
  "draft",
  "submitted",
  "in-progress",
  "response-received",
  "appeal-ready",
  "closed",
];
