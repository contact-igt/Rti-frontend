export type Citizen = { id: string; name: string; email: string; phone?: string };

export type Department = { id: string; name: string; jurisdiction: string; state?: string };

export type RTIDraft = { id: string; subject: string; questions: string[]; departmentId?: string; updatedAt: string };

export type ApplicationStatus = "draft" | "submitted" | "in-progress" | "response-received" | "appeal-ready" | "closed";

export type TimelineEvent = { id: string; occurredAt: string; title: string; description?: string };

export type RTIApplication = {
  id: string;
  referenceNumber: string;
  subject: string;
  status: ApplicationStatus;
  departmentId: string;
  citizenId: string;
  timeline: TimelineEvent[];
};
