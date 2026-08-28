export type RTIJurisdiction = "central" | "state" | "unknown";

export type RTIAnalysis = {
  issueType: string;
  informationNeeded: string[];
  jurisdiction: RTIJurisdiction;
  clarificationNeeded: boolean;
  clarificationQuestion: string | null;
};

export type ResponseMeta = { source?: "ai" | "fallback" | "curated_matcher"; degraded?: boolean; demo?: boolean };

export type AuthorityOption = {
  authorityId: string;
  authorityName: string;
  department?: string;
  jurisdiction: "central" | "state";
  confidence: number;
  reason: string;
};

export type SelectedAuthority = Pick<AuthorityOption, "authorityId" | "authorityName" | "jurisdiction">;

export type AuthorityResolution =
  | { status: "clarification_required"; jurisdiction: RTIJurisdiction; question: string }
  | { status: "recommended"; recommendation: AuthorityOption & { alternatives: AuthorityOption[] } };

export type RTIDraft = {
  subject: string;
  context: string | null;
  questions: string[];
  authorityId: string;
  warnings: string[];
};

export type RTIApplicant = {
  fullName: string;
  email: string | null;
  phone: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  stateOrUt: string;
  postalCode: string;
  country: "India";
  citizenshipConfirmed: boolean;
  bplStatus: "yes" | "no";
};

export type SupportingDocument = {
  id: string;
  fileName: string;
  mimeType: "application/pdf" | "image/jpeg" | "image/png";
  sizeBytes: number;
  purpose: string | null;
};

export type FilingFeeStatus = "standard_fee" | "bpl_exempt";

export type FilingReview = {
  problem: string;
  analysis: RTIAnalysis;
  authority: SelectedAuthority;
  draft: RTIDraft;
  applicant: RTIApplicant;
  documents: SupportingDocument[];
  feeStatus: FilingFeeStatus;
};

export type DemoPaymentMode = "demo_upi" | "demo_card" | "demo_netbanking" | "bpl_exempt";
export type DemoPayment = {
  status: "not_required" | "pending" | "paid" | "failed";
  amountPaise: number;
  mode: DemoPaymentMode;
  transactionId: string | null;
  paidAt: string | null;
};

export type PaymentProof = { payment: DemoPayment; paymentProofToken: string; expiresAt: string };

export type RTIReceipt = {
  registrationNumber: string;
  applicationId: string;
  authorityName: string;
  submittedAt: string;
  payment: { status: "paid" | "not_required"; amountPaise: number; transactionId: string | null };
  status: "submitted";
  prototypeNotice: string;
};

export type CreatedApplication = {
  id: string;
  registrationNumber: string;
  status: string;
  submittedAt: string;
  draft: RTIDraft;
  authority: SelectedAuthority;
  prototype: true;
};

export type ApplicationStatus = "draft" | "submitted" | "received" | "transferred" | "in_progress" | "response_received" | "action_required" | "completed";

export type ApplicationTimelineEvent = {
  id: string;
  status: ApplicationStatus;
  title: string;
  description: string;
  occurredAt: string;
};

export type ApplicationListItem = {
  id: string;
  registrationNumber: string;
  subject: string;
  authorityName: string;
  status: ApplicationStatus;
  submittedAt: string;
};

export type GovernmentReply = {
  id: string;
  body: string;
  referenceNumber: string | null;
  subject: string | null;
  officerName: string | null;
  officerDesignation: string | null;
  attachments: SupportingDocument[];
  receivedAt: string;
  source: "demo";
  prototype: true;
};

export type GovernmentReplyInput = {
  body: string;
  referenceNumber?: string | null;
  subject?: string | null;
  officerName?: string | null;
  officerDesignation?: string | null;
  attachments?: SupportingDocument[];
};

export type ReplyAnalysis = {
  summary: string;
  overallStatus: "answered" | "partially_answered" | "not_answered" | "unclear";
  questionAssessments: { question: string; status: "answered" | "partially_answered" | "not_answered" | "unclear"; explanation: string }[];
  keyInformation: string[];
  missingInformation: string[];
  replySignals: { transferMentioned: boolean; rejectionMentioned: boolean; exemptionMentioned: boolean; recordsUnavailableMentioned: boolean };
  recommendedAction: "no_action" | "review_reply" | "seek_clarification" | "consider_first_appeal";
  actionReason: string;
  disclaimer: string;
};

export type FirstAppealDraft = {
  subject: string;
  addressedTo: { title: "First Appellate Authority"; publicAuthorityName: string };
  originalRegistrationNumber: string;
  applicationDate: string;
  replyDate: string | null;
  grounds: string[];
  requestedRelief: string[];
  closingStatement: string;
  warnings: string[];
  feeRequired: false;
  disclaimer: string;
};

export type FirstAppealGuidance = {
  applicationId: string;
  registrationNumber: string;
  status: "not_yet_due" | "may_consider" | "recommended" | "not_currently_recommended";
  reason: "no_reply_after_30_days" | "incomplete_reply" | "unanswered_information" | "unclear_reply" | "reply_appears_complete" | "awaiting_response";
  explanation: string;
  daysSinceSubmission: number;
  responseReceived: boolean;
  unansweredCount: number;
  partiallyAnsweredCount: number;
  feeRequired: false;
  originalRegistrationNumber: string;
  disclaimer: string;
};

export type RTIApplicationDetail = FilingReview & {
  id: string;
  ownerUserId: string;
  registrationNumber: string;
  status: ApplicationStatus;
  payment: DemoPayment;
  submittedAt: string;
  timeline: ApplicationTimelineEvent[];
  governmentReply?: GovernmentReply | null;
  replyAnalysis?: ReplyAnalysis | null;
  firstAppealDraft?: FirstAppealDraft | null;
  prototype: true;
};

export type ApplicationTrackingView = {
  applicationId: string;
  registrationNumber: string;
  subject: string;
  authority: SelectedAuthority;
  status: ApplicationStatus;
  submittedAt: string;
  timeline: ApplicationTimelineEvent[];
  prototype: true;
};

export type DemoUser = {
  id: "user_demo_citizen";
  email: string;
  displayName: string;
  role: "citizen";
  prototype: true;
};

export type FilingStage =
  | "problem"
  | "analysis"
  | "clarification"
  | "authority-unsupported"
  | "authority"
  | "draft"
  | "applicant"
  | "review"
  | "auth"
  | "payment"
  | "receipt"
  | "state-blocked";

export type ClarificationState = {
  source: "analysis" | "authority";
  question: string;
  jurisdiction: RTIJurisdiction;
  answer?: ClarificationAnswer;
} | null;

export type ClarificationAnswer = {
  text?: string;
  jurisdiction?: RTIJurisdiction;
  state?: string;
};

export type ClarificationAttempt = {
  identity: string;
  question: string;
  jurisdiction: RTIJurisdiction;
  answer: ClarificationAnswer;
  submitted: true;
};

export type FilingState = {
  stage: FilingStage;
  problem: string;
  effectiveProblem: string;
  analysis: RTIAnalysis | null;
  analysisMeta: ResponseMeta | null;
  clarification: ClarificationState;
  clarificationHistory: ClarificationAttempt[];
  authorityResolution: AuthorityResolution | null;
  authority: SelectedAuthority | null;
  draft: RTIDraft | null;
  applicant: RTIApplicant;
  documents: SupportingDocument[];
  review: FilingReview | null;
  paymentProof: PaymentProof | null;
  submissionKey: string;
  application: CreatedApplication | null;
  receipt: RTIReceipt | null;
};
