import { apiRequest } from "@/lib/api/client";
import type {
  AuthorityResolution,
  DemoPaymentMode,
  FilingFeeStatus,
  FilingReview,
  PaymentProof,
  ResponseMeta,
  RTIAnalysis,
  RTIApplicant,
  RTIDraft,
  RTIReceipt,
  CreatedApplication,
  SelectedAuthority,
  SupportingDocument,
  RTIJurisdiction,
  ApplicationListItem,
  ApplicationTrackingView,
  RTIApplicationDetail,
  FirstAppealDraft,
  FirstAppealGuidance,
  GovernmentReply,
  GovernmentReplyInput,
  ReplyAnalysis,
} from "@/types/filing";

type DataResponse<T> = { data: T; meta?: ResponseMeta };

export function analyseRTI(problem: string) {
  return apiRequest<DataResponse<RTIAnalysis>>("/api/rti/analyse", { method: "POST", body: { problem } });
}

export function findAuthority(input: { analysis: RTIAnalysis; jurisdictionAnswer?: RTIJurisdiction; state?: string | null }) {
  return apiRequest<DataResponse<AuthorityResolution>>("/api/rti/authority", { method: "POST", body: input });
}

export function generateDraft(input: { problem: string; analysis: RTIAnalysis; authority: SelectedAuthority }) {
  return apiRequest<DataResponse<RTIDraft>>("/api/rti/draft", { method: "POST", body: input });
}

export function validateApplicant(applicant: RTIApplicant) {
  return apiRequest<DataResponse<RTIApplicant>>("/api/rti/applicant/validate", { method: "POST", body: applicant });
}

export type ReviewRequest = {
  problem: string;
  analysis: RTIAnalysis;
  authority: SelectedAuthority;
  draft: RTIDraft;
  applicant: RTIApplicant;
  documents: SupportingDocument[];
};

export function reviewFiling(input: ReviewRequest) {
  return apiRequest<DataResponse<FilingReview>>("/api/rti/review", { method: "POST", body: input });
}

export function createDemoPayment(input: { feeStatus: FilingFeeStatus; mode: DemoPaymentMode; simulateFailure?: boolean }, token: string) {
  return apiRequest<DataResponse<PaymentProof>>("/api/rti/payment", { method: "POST", body: input, token });
}

export function createApplication(input: { submissionKey: string; review: FilingReview; payment: PaymentProof["payment"]; paymentProofToken: string }, token: string) {
  return apiRequest<DataResponse<{ application: CreatedApplication; receipt: RTIReceipt }>>("/api/rti/applications", { method: "POST", body: input, token });
}

export function listApplications(token: string) {
  return apiRequest<{ data: ApplicationListItem[]; meta: { count: number } }>("/api/rti/applications", { token });
}

export function getApplication(id: string, token: string) {
  return apiRequest<{ data: RTIApplicationDetail }>(`/api/rti/applications/${encodeURIComponent(id)}`, { token });
}

export function trackApplication(registrationNumber: string) {
  return apiRequest<{ data: ApplicationTrackingView; meta: { demo: true } }>(`/api/rti/track/${encodeURIComponent(registrationNumber)}`);
}

export function attachDemoReply(id: string, input: GovernmentReplyInput | { scenario: "pension_partial_reply" }, token: string) {
  return apiRequest<DataResponse<{ application: RTIApplicationDetail; reply: GovernmentReply }>>(`/api/rti/applications/${encodeURIComponent(id)}/reply`, { method: "POST", body: input, token });
}

export function analyseReply(id: string, token: string) {
  return apiRequest<DataResponse<ReplyAnalysis>>(`/api/rti/applications/${encodeURIComponent(id)}/reply/analyse`, { method: "POST", token });
}

export function getAppealGuidance(id: string, token: string) {
  return apiRequest<DataResponse<FirstAppealGuidance>>(`/api/rti/applications/${encodeURIComponent(id)}/appeal/guidance`, { token });
}

export function generateAppealDraft(id: string, citizenNotes: string | null, token: string) {
  return apiRequest<DataResponse<FirstAppealDraft>>(`/api/rti/applications/${encodeURIComponent(id)}/appeal/draft`, { method: "POST", body: { citizenNotes }, token });
}
