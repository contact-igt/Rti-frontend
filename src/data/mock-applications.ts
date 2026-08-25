import type { RTIApplication } from "@/types";

export const mockApplications: readonly RTIApplication[] = [
  {
    id: "demo",
    referenceNumber: "RTI-DEMO-001",
    subject: "Status of a public works request",
    status: "in-progress",
    departmentId: "municipal-demo",
    citizenId: "citizen-demo",
    timeline: [{ id: "submitted", occurredAt: "2026-08-20T09:00:00.000Z", title: "Application submitted" }],
  },
];
