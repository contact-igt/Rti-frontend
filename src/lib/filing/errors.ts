import { ApiError } from "@/lib/api/client";

const messages: Record<string, string> = {
  INVALID_INPUT: "Please check the information you entered and correct the highlighted step.",
  AUTHENTICATION_REQUIRED: "Please sign in to save and continue with this application.",
  SESSION_EXPIRED: "Your demo session has expired. Sign in again to continue; your filing work is still here.",
  INVALID_CREDENTIALS: "The email or password is not correct. Please check both and try again.",
  TOO_MANY_ATTEMPTS: "There have been too many sign-in attempts. Please wait before trying again.",
  STATE_FLOW_NOT_SUPPORTED: "RTI Saathi currently supports the complete guided filing journey for selected Central Government authorities. We don’t yet have verified filing rules for this State authority.",
  AUTHORITY_NOT_SUPPORTED: "Please choose one of the verified Central Government authorities shown for this request.",
  CITIZENSHIP_CONFIRMATION_REQUIRED: "Please confirm that the applicant is an Indian citizen before continuing.",
  FILING_VALIDATION_FAILED: "We found something that needs to be corrected before you can continue.",
  BPL_PROOF_REQUIRED: "Add BPL proof metadata before continuing with the fee-exempt application.",
  PAYMENT_REQUIRED: "Complete the demo payment step before submitting the application.",
  PAYMENT_FAILED: "The demo payment did not complete. Please try the demo step again.",
  PAYMENT_MISMATCH: "The payment step no longer matches this application. Please create a new demo payment proof.",
  PAYMENT_PROOF_INVALID: "This demo payment proof no longer matches the application. Please create a new one.",
  PAYMENT_PROOF_EXPIRED: "The demo payment proof has expired. Please create a new one.",
  PAYMENT_PROOF_USED: "This demo payment proof has already been used. Check My Applications before trying again.",
  SUBMISSION_KEY_CONFLICT: "This filing attempt conflicts with an earlier submission. Start a fresh filing attempt if needed.",
  REQUEST_TOO_LARGE: "The information entered is too large to send. Shorten it and try again.",
  CORS_ORIGIN_DENIED: "This frontend is not currently permitted to connect to RTI Saathi.",
  INTERNAL_ERROR: "RTI Saathi could not complete this step. Your work has not been cleared.",
  APPLICATION_NOT_FOUND: "This application could not be found or is not available to this account.",
  REPLY_NOT_FOUND: "No reply is recorded for this application yet.",
  APPEAL_NOT_YET_DUE: "Based on the current application timeline, RTI Saathi does not recommend preparing a first appeal yet.",
  REPLY_ANALYSIS_REQUIRED: "Understand the recorded reply before preparing first appeal grounds.",
  APPEAL_NOT_RECOMMENDED: "The recorded reply appears substantially complete, so RTI Saathi does not currently recommend preparing a first appeal.",
};

export type CitizenError = { message: string; code?: string; network: boolean };

export function toCitizenError(error: unknown): CitizenError {
  if (error instanceof ApiError) {
    return { message: (error.code && messages[error.code]) || "RTI Saathi could not complete this step. Your work has not been cleared.", code: error.code, network: false };
  }
  return { message: "We couldn’t reach RTI Saathi right now. Your work on this page has not been cleared.", network: true };
}
