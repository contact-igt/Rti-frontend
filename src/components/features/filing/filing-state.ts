import type { FilingState, RTIApplicant, RTIDraft, SelectedAuthority, SupportingDocument } from "@/types/filing";

export const emptyApplicant: RTIApplicant = {
  fullName: "",
  email: null,
  phone: null,
  addressLine1: "",
  addressLine2: null,
  city: "",
  stateOrUt: "",
  postalCode: "",
  country: "India",
  citizenshipConfirmed: false,
  bplStatus: "no",
};

export const initialFilingState: FilingState = {
  stage: "problem",
  problem: "",
  effectiveProblem: "",
  analysis: null,
  analysisMeta: null,
  clarification: null,
  authorityResolution: null,
  authority: null,
  draft: null,
  applicant: emptyApplicant,
  documents: [],
  review: null,
  paymentProof: null,
  submissionKey: "",
  application: null,
  receipt: null,
};

export type FilingAction =
  | { type: "HYDRATE"; state: Partial<FilingState> }
  | { type: "SET_SUBMISSION_KEY"; key: string }
  | { type: "SET_PROBLEM"; problem: string }
  | { type: "SET_ANALYSIS"; analysis: FilingState["analysis"]; meta: FilingState["analysisMeta"]; effectiveProblem: string }
  | { type: "SET_CLARIFICATION"; clarification: FilingState["clarification"] }
  | { type: "SET_AUTHORITY_RESOLUTION"; resolution: FilingState["authorityResolution"] }
  | { type: "SET_AUTHORITY"; authority: SelectedAuthority }
  | { type: "SET_DRAFT"; draft: RTIDraft }
  | { type: "EDIT_DRAFT"; draft: RTIDraft }
  | { type: "SET_APPLICANT"; applicant: RTIApplicant }
  | { type: "SET_DOCUMENTS"; documents: SupportingDocument[] }
  | { type: "SET_REVIEW"; review: FilingState["review"] }
  | { type: "SET_PAYMENT_PROOF"; paymentProof: FilingState["paymentProof"] }
  | { type: "SET_RECEIPT"; application: NonNullable<FilingState["application"]>; receipt: NonNullable<FilingState["receipt"]> }
  | { type: "GO"; stage: FilingState["stage"] }
  | { type: "RESET" };

export function filingReducer(state: FilingState, action: FilingAction): FilingState {
  switch (action.type) {
    case "HYDRATE": return { ...initialFilingState, ...action.state, applicant: emptyApplicant, documents: [], review: null, paymentProof: null, application: null, receipt: null };
    case "SET_SUBMISSION_KEY": return { ...state, submissionKey: action.key };
    case "SET_PROBLEM":
      return { ...state, problem: action.problem, effectiveProblem: action.problem, analysis: null, analysisMeta: null, clarification: null, authorityResolution: null, authority: null, draft: null, review: null, paymentProof: null };
    case "SET_ANALYSIS":
      return { ...state, analysis: action.analysis, analysisMeta: action.meta, effectiveProblem: action.effectiveProblem, clarification: null, authorityResolution: null, authority: null, draft: null, review: null, paymentProof: null };
    case "SET_CLARIFICATION": return { ...state, clarification: action.clarification, stage: "clarification" };
    case "SET_AUTHORITY_RESOLUTION": return { ...state, authorityResolution: action.resolution, stage: "authority" };
    case "SET_AUTHORITY": {
      const changed = state.authority?.authorityId !== action.authority.authorityId;
      return { ...state, authority: action.authority, draft: changed ? null : state.draft, review: null, paymentProof: null };
    }
    case "SET_DRAFT": return { ...state, draft: action.draft, review: null, paymentProof: null, stage: "draft" };
    case "EDIT_DRAFT": return { ...state, draft: action.draft, review: null, paymentProof: null };
    case "SET_APPLICANT": return { ...state, applicant: action.applicant, review: null, paymentProof: null };
    case "SET_DOCUMENTS": return { ...state, documents: action.documents, review: null, paymentProof: null };
    case "SET_REVIEW": return { ...state, review: action.review, paymentProof: null, stage: "review" };
    case "SET_PAYMENT_PROOF": return { ...state, paymentProof: action.paymentProof };
    case "SET_RECEIPT": return { ...state, application: action.application, receipt: action.receipt, stage: "receipt" };
    case "GO": return { ...state, stage: action.stage };
    case "RESET": return { ...initialFilingState, submissionKey: createSubmissionKey() };
  }
}

export function createSubmissionKey(): string {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `filing-${id}`;
}
