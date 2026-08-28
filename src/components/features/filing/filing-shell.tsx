"use client";

import { RotateCcw, ShieldCheck } from "lucide-react";
import { useEffect, useReducer, useRef, useState } from "react";
import { getSession, login as loginRequest } from "@/lib/api/auth";
import { clearSession, readSession, writeSession } from "@/lib/auth/session";
import { createApplication, createDemoPayment, findAuthority, generateDraft, reviewFiling, validateApplicant, analyseRTI } from "@/lib/api/rti";
import { clarificationIdentity, hasSubmittedClarification, previousClarificationAnswer } from "@/lib/filing/clarification-history";
import { clearFilingProgress, readFilingProgress, saveFilingProgress, takeStartProblem } from "@/lib/filing/storage";
import { toCitizenError, type CitizenError } from "@/lib/filing/errors";
import type { AuthorityOption, ClarificationAnswer, ClarificationAttempt, DemoPaymentMode, RTIAnalysis, RTIJurisdiction } from "@/types/filing";
import { AnalysisStep } from "./analysis-step";
import { ApplicantStep } from "./applicant-step";
import { AuthStep } from "./auth-step";
import { AuthorityStep } from "./authority-step";
import { AuthorityUnsupported } from "./authority-unsupported";
import { ClarificationStep } from "./clarification-step";
import { DraftStep } from "./draft-step";
import { FilingError } from "./filing-error";
import { FilingProgress } from "./filing-progress";
import { createSubmissionKey, filingReducer, initialFilingState } from "./filing-state";
import { PaymentStep } from "./payment-step";
import { ProblemStep } from "./problem-step";
import { ReceiptStep } from "./receipt-step";
import { ReviewStep } from "./review-step";
import { StateBlocked } from "./state-blocked";

export function FilingShell() {
  const [state, dispatch] = useReducer(filingReducer, initialFilingState);
  const [pendingText, setPendingText] = useState("");
  const [error, setError] = useState<CitizenError | null>(null);
  const retryRef = useRef<(() => void) | null>(null);
  const submissionInFlightRef = useRef(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startProblem = takeStartProblem();
    const saved = readFilingProgress();
    if (startProblem) {
      dispatch({ type: "HYDRATE", state: { problem: startProblem, effectiveProblem: startProblem, submissionKey: createSubmissionKey(), stage: "problem" } });
    } else if (saved) {
      dispatch({ type: "HYDRATE", state: { ...saved, submissionKey: saved.submissionKey || createSubmissionKey() } });
    } else {
      dispatch({ type: "SET_SUBMISSION_KEY", key: createSubmissionKey() });
    }
  }, []);

  const hydrated = Boolean(state.submissionKey);

  useEffect(() => {
    if (hydrated && (state.problem || state.analysis || state.draft)) saveFilingProgress(state);
  }, [hydrated, state]);

  useEffect(() => {
    if (!hydrated) return;
    requestAnimationFrame(() => shellRef.current?.querySelector<HTMLElement>("#filing-step-title")?.focus());
  }, [hydrated, state.stage]);

  useEffect(() => {
    if (error) requestAnimationFrame(() => errorRef.current?.focus());
  }, [error]);

  async function perform(label: string, action: () => Promise<void>) {
    setPendingText(label);
    setError(null);
    retryRef.current = () => void perform(label, action);
    try {
      await action();
      retryRef.current = null;
    } catch (caught) {
      const nextError = toCitizenError(caught);
      if (nextError.code === "STATE_FLOW_NOT_SUPPORTED") {
        dispatch({ type: "GO", stage: "state-blocked" });
      } else {
        if (["SESSION_EXPIRED", "AUTHENTICATION_REQUIRED"].includes(nextError.code ?? "")) clearSession();
        if (["PAYMENT_MISMATCH", "PAYMENT_PROOF_INVALID", "PAYMENT_PROOF_EXPIRED"].includes(nextError.code ?? "")) dispatch({ type: "SET_PAYMENT_PROOF", paymentProof: null });
        setError(nextError);
      }
    } finally {
      setPendingText("");
    }
  }

  function analyseProblem(problem: string) {
    dispatch({ type: "SET_PROBLEM", problem });
    void perform("Understanding your request…", async () => {
      const response = await analyseRTI(problem);
      dispatch({ type: "SET_ANALYSIS", analysis: response.data, meta: response.meta ?? null, effectiveProblem: problem });
      if (response.data.clarificationNeeded && response.data.clarificationQuestion) {
        dispatch({ type: "SET_CLARIFICATION", clarification: { source: "analysis", question: response.data.clarificationQuestion, jurisdiction: response.data.jurisdiction } });
      } else {
        dispatch({ type: "GO", stage: "analysis" });
      }
    });
  }

  function resolveAuthority(jurisdictionAnswer?: RTIJurisdiction, stateName?: string, submittedAttempt?: ClarificationAttempt) {
    if (!state.analysis) return;
    const analysis = state.analysis;
    const history = submittedAttempt ? [...state.clarificationHistory, submittedAttempt] : state.clarificationHistory;
    void perform("Checking the likely authority…", async () => {
      const response = await findAuthority({ analysis, jurisdictionAnswer, state: stateName || undefined });
      if (response.data.status === "clarification_required") {
        const prompt = { question: response.data.question, jurisdiction: response.data.jurisdiction };
        if (hasSubmittedClarification(history, prompt, analysis)) {
          dispatch({ type: "GO", stage: "authority-unsupported" });
          return;
        }
        dispatch({ type: "SET_CLARIFICATION", clarification: { source: "authority", ...prompt, answer: previousClarificationAnswer(history, prompt) } });
      } else {
        dispatch({ type: "SET_AUTHORITY_RESOLUTION", resolution: response.data });
      }
    });
  }

  function answerClarification(answer: { text?: string; jurisdiction?: RTIJurisdiction; state?: string }) {
    if (!state.clarification || !state.analysis) return;
    const clarification = state.clarification;
    if (answer.jurisdiction) {
      const attempt = createClarificationAttempt(clarification, answer, state.analysis);
      dispatch({ type: "RECORD_CLARIFICATION", attempt });
      resolveAuthority(answer.jurisdiction, answer.state, attempt);
      return;
    }
    if (state.clarification.source === "authority" && state.clarification.jurisdiction === "state") {
      const attempt = createClarificationAttempt(clarification, answer, state.analysis);
      dispatch({ type: "RECORD_CLARIFICATION", attempt });
      resolveAuthority("state", answer.text, attempt);
      return;
    }
    const effectiveProblem = `${state.effectiveProblem || state.problem}\nAdditional detail: ${answer.text}`;
    void perform("Understanding the added detail…", async () => {
      const response = await analyseRTI(effectiveProblem);
      const attempt = createClarificationAttempt(clarification, answer, response.data);
      dispatch({ type: "SET_ANALYSIS", analysis: response.data, meta: response.meta ?? null, effectiveProblem });
      dispatch({ type: "RECORD_CLARIFICATION", attempt });
      if (response.data.clarificationNeeded && response.data.clarificationQuestion) {
        dispatch({ type: "SET_CLARIFICATION", clarification: { source: "analysis", question: response.data.clarificationQuestion, jurisdiction: response.data.jurisdiction } });
      } else {
        dispatch({ type: "GO", stage: "analysis" });
      }
    });
  }

  function confirmAuthority(option: AuthorityOption) {
    if (!state.analysis) return;
    const authority = { authorityId: option.authorityId, authorityName: option.authorityName, jurisdiction: option.jurisdiction } as const;
    if (state.authority?.authorityId === authority.authorityId && state.draft) { dispatch({ type: "GO", stage: "draft" }); return; }
    dispatch({ type: "SET_AUTHORITY", authority });
    void perform("Preparing your RTI request…", async () => {
      const response = await generateDraft({ problem: state.effectiveProblem || state.problem, analysis: state.analysis!, authority });
      dispatch({ type: "SET_DRAFT", draft: response.data });
    });
  }

  function prepareReview() {
    if (!state.analysis || !state.authority || !state.draft) return;
    void perform("Checking your details…", async () => {
      const applicantResponse = await validateApplicant(state.applicant);
      dispatch({ type: "SET_APPLICANT", applicant: applicantResponse.data });
      const response = await reviewFiling({ problem: state.effectiveProblem || state.problem, analysis: state.analysis!, authority: state.authority!, draft: state.draft!, applicant: applicantResponse.data, documents: state.documents });
      dispatch({ type: "SET_REVIEW", review: response.data });
    });
  }

  function continueFromReview() {
    const session = readSession();
    if (!session) { dispatch({ type: "GO", stage: "auth" }); return; }
    void perform("Checking your session…", async () => {
      try {
        await getSession(session.token);
        dispatch({ type: "GO", stage: "payment" });
      } catch (caught) {
        const authError = toCitizenError(caught);
        if (["SESSION_EXPIRED", "AUTHENTICATION_REQUIRED"].includes(authError.code ?? "")) {
          clearSession();
          dispatch({ type: "GO", stage: "auth" });
          return;
        }
        throw caught;
      }
    });
  }

  function login(email: string, password: string) {
    void perform("Signing in…", async () => {
      const response = await loginRequest(email, password);
      writeSession({ token: response.data.session.token, expiresAt: response.data.session.expiresAt });
      dispatch({ type: "GO", stage: "payment" });
    });
  }

  function issuePayment(mode: DemoPaymentMode) {
    const session = readSession();
    if (!session || !state.review) { dispatch({ type: "GO", stage: "auth" }); return; }
    void perform("Creating secure demo proof…", async () => {
      const response = await createDemoPayment({ feeStatus: state.review!.feeStatus, mode }, session.token);
      dispatch({ type: "SET_PAYMENT_PROOF", paymentProof: response.data });
    });
  }

  function submitApplication() {
    if (submissionInFlightRef.current) return;
    const session = readSession();
    if (!session || !state.review || !state.paymentProof) { dispatch({ type: "GO", stage: session ? "payment" : "auth" }); return; }
    const submissionKey = state.submissionKey || createSubmissionKey();
    if (!state.submissionKey) dispatch({ type: "SET_SUBMISSION_KEY", key: submissionKey });
    submissionInFlightRef.current = true;
    void perform("Creating your application…", async () => {
      const response = await createApplication({ submissionKey, review: state.review!, payment: state.paymentProof!.payment, paymentProofToken: state.paymentProof!.paymentProofToken }, session.token);
      dispatch({ type: "SET_RECEIPT", application: response.data.application, receipt: response.data.receipt });
      clearFilingProgress();
    }).finally(() => { submissionInFlightRef.current = false; });
  }

  function startOver() {
    if ((state.problem || state.analysis || state.draft) && !window.confirm("Start over and clear this filing work? Your sign-in session will remain active.")) return;
    clearFilingProgress();
    setError(null);
    dispatch({ type: "RESET" });
  }

  if (!hydrated) return <main id="main-content" className="filing-page"><div className="container filing-loading" aria-live="polite">Preparing your RTI journey…</div></main>;

  const pending = Boolean(pendingText);
  return (
    <main id="main-content" className="filing-page">
      <div className="container filing-layout" ref={shellRef}>
        <aside className="filing-sidebar"><div><p className="section-index">Guided RTI preparation</p><h2>From your concern to a clear request.</h2><p>Six citizen-friendly stages. No legal terminology required.</p></div>{state.stage !== "receipt" ? <FilingProgress stage={state.stage} /> : null}<div className="filing-boundary"><ShieldCheck aria-hidden="true" /><p><strong>You remain in control.</strong> Review every detail before this prototype application is created.</p></div>{state.stage !== "receipt" ? <button className="start-over" type="button" onClick={startOver}><RotateCcw aria-hidden="true" /> Start over</button> : null}</aside>
        <div className="filing-main">
          <div className="async-status sr-only" aria-live="polite">{pendingText}</div>
          {error ? <FilingError message={error.message} onRetry={retryRef.current ?? undefined} errorRef={errorRef} /> : null}
          {state.stage === "problem" ? <ProblemStep key={state.problem} initialProblem={state.problem} pending={pending} onSubmit={analyseProblem} /> : null}
          {state.stage === "analysis" && state.analysis ? <AnalysisStep analysis={state.analysis} meta={state.analysisMeta} pending={pending} onContinue={() => resolveAuthority()} onEdit={() => dispatch({ type: "GO", stage: "problem" })} /> : null}
          {state.stage === "clarification" && state.clarification ? <ClarificationStep key={`${state.clarification.source}:${state.clarification.jurisdiction}:${state.clarification.question}`} clarification={state.clarification} pending={pending} onBack={() => dispatch({ type: "GO", stage: state.analysis ? "analysis" : "problem" })} onSubmit={answerClarification} /> : null}
          {state.stage === "authority-unsupported" ? <AuthorityUnsupported onEdit={() => dispatch({ type: "GO", stage: "problem" })} onStartOver={startOver} /> : null}
          {state.stage === "authority" && state.authorityResolution?.status === "recommended" ? <AuthorityStep resolution={state.authorityResolution} selectedId={state.authority?.authorityId} pending={pending} onBack={() => dispatch({ type: "GO", stage: "analysis" })} onConfirm={confirmAuthority} /> : null}
          {state.stage === "draft" && state.draft && state.authority ? <DraftStep draft={state.draft} authority={state.authority} onBack={() => dispatch({ type: "GO", stage: "authority" })} onChange={(draft) => dispatch({ type: "EDIT_DRAFT", draft })} onContinue={() => dispatch({ type: "GO", stage: "applicant" })} /> : null}
          {state.stage === "applicant" ? <ApplicantStep applicant={state.applicant} documents={state.documents} pending={pending} onBack={() => dispatch({ type: "GO", stage: "draft" })} onApplicantChange={(applicant) => dispatch({ type: "SET_APPLICANT", applicant })} onDocumentsChange={(documents) => dispatch({ type: "SET_DOCUMENTS", documents })} onSubmit={prepareReview} /> : null}
          {state.stage === "review" && state.review ? <ReviewStep review={state.review} pending={pending} onBack={() => dispatch({ type: "GO", stage: "applicant" })} onEdit={(stage) => dispatch({ type: "GO", stage })} onContinue={continueFromReview} /> : null}
          {state.stage === "auth" ? <AuthStep pending={pending} onBack={() => dispatch({ type: "GO", stage: "review" })} onLogin={login} /> : null}
          {state.stage === "payment" && state.review ? <PaymentStep review={state.review} paymentProof={state.paymentProof} pending={pending} onBack={() => dispatch({ type: "GO", stage: "review" })} onCreatePayment={issuePayment} onSubmit={submitApplication} /> : null}
          {state.stage === "receipt" && state.receipt && state.application ? <ReceiptStep receipt={state.receipt} application={state.application} /> : null}
          {state.stage === "state-blocked" ? <StateBlocked onEdit={() => dispatch({ type: "GO", stage: "problem" })} /> : null}
        </div>
      </div>
    </main>
  );
}

function createClarificationAttempt(
  clarification: { question: string; jurisdiction: RTIJurisdiction },
  answer: ClarificationAnswer,
  analysis: RTIAnalysis,
): ClarificationAttempt {
  return {
    identity: clarificationIdentity(clarification, analysis),
    question: clarification.question,
    jurisdiction: clarification.jurisdiction,
    answer,
    submitted: true,
  };
}
