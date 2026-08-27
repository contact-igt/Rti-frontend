"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Clipboard, FilePenLine, FileText, Info, Printer, Scale, Sparkles } from "lucide-react";
import { analyseReply, attachDemoReply, generateAppealDraft, getAppealGuidance } from "@/lib/api/rti";
import { ApiError } from "@/lib/api/client";
import { assessmentLabel, formatBytes, formatDate, guidanceLabel, overallUnderstanding } from "@/lib/applications/presentation";
import { toCitizenError } from "@/lib/filing/errors";
import type { FirstAppealDraft, FirstAppealGuidance, GovernmentReplyInput, RTIApplicationDetail } from "@/types/filing";

type Operation = "attach" | "analyse" | "draft" | null;

export function ReplyWorkflow({ application, token, onCanonicalRefresh, onSessionExpired }: { application: RTIApplicationDetail; token: string; onCanonicalRefresh: () => Promise<void>; onSessionExpired: () => void }) {
  const [guidance, setGuidance] = useState<FirstAppealGuidance | null>(null);
  const [guidanceError, setGuidanceError] = useState("");
  const [guidanceLoading, setGuidanceLoading] = useState(true);
  const [operation, setOperation] = useState<Operation>(null);
  const [actionError, setActionError] = useState("");
  const [citizenNotes, setCitizenNotes] = useState("");
  const understandingRef = useRef<HTMLElement>(null);

  const handleError = useCallback((cause: unknown, fallback: string) => {
    if (cause instanceof ApiError && (cause.status === 401 || cause.code === "SESSION_EXPIRED" || cause.code === "AUTHENTICATION_REQUIRED")) {
      onSessionExpired();
      return;
    }
    setActionError(toCitizenError(cause).code ? toCitizenError(cause).message : fallback);
  }, [onSessionExpired]);

  const loadGuidance = useCallback(async () => {
    setGuidanceLoading(true);
    setGuidanceError("");
    try {
      const response = await getAppealGuidance(application.id, token);
      setGuidance(response.data);
    } catch (cause) {
      if (cause instanceof ApiError && (cause.status === 401 || cause.code === "SESSION_EXPIRED" || cause.code === "AUTHENTICATION_REQUIRED")) onSessionExpired();
      else setGuidanceError(toCitizenError(cause).message);
    } finally {
      setGuidanceLoading(false);
    }
  }, [application.id, onSessionExpired, token]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadGuidance(), 0);
    return () => window.clearTimeout(timer);
  }, [application.governmentReply?.receivedAt, application.replyAnalysis, application.firstAppealDraft, loadGuidance]);

  async function attach(input: GovernmentReplyInput | { scenario: "pension_partial_reply" }) {
    setOperation("attach"); setActionError("");
    try {
      await attachDemoReply(application.id, input, token);
      await onCanonicalRefresh();
    } catch (cause) { handleError(cause, "We couldn’t add this demo reply. Check the information and try again."); }
    finally { setOperation(null); }
  }

  async function analyse() {
    setOperation("analyse"); setActionError("");
    try {
      await analyseReply(application.id, token);
      await onCanonicalRefresh();
      window.requestAnimationFrame(() => understandingRef.current?.focus());
    } catch (cause) { handleError(cause, "We couldn’t understand this reply right now. Try again."); }
    finally { setOperation(null); }
  }

  async function draft() {
    setOperation("draft"); setActionError("");
    try {
      await generateAppealDraft(application.id, citizenNotes.trim() || null, token);
      await onCanonicalRefresh();
      window.requestAnimationFrame(() => document.getElementById("appeal-draft")?.focus());
    } catch (cause) { handleError(cause, "We couldn’t prepare the first appeal draft. Try again."); }
    finally { setOperation(null); }
  }

  const reply = application.governmentReply;
  const analysis = application.replyAnalysis;
  const draftPermitted = guidance?.status === "recommended" || (guidance?.status === "may_consider" && (!reply || Boolean(analysis)));

  return (
    <section className="post-filing-workflow" id="reply-workflow" aria-labelledby="post-filing-title">
      <header className="post-filing-header"><div><p>Reply and first appeal</p><h2 id="post-filing-title">Continue this case</h2></div><ol aria-label="Post-filing progress"><li className={reply ? "is-complete" : "is-current"}><span>1</span>Reply</li><li className={analysis ? "is-complete" : reply ? "is-current" : ""}><span>2</span>Understanding</li><li className={application.firstAppealDraft ? "is-complete" : analysis ? "is-current" : ""}><span>3</span>Appeal</li></ol></header>

      {actionError ? <div className="post-filing-error" role="alert" tabIndex={-1}><AlertCircle aria-hidden="true" /><p><strong>This action could not be completed</strong>{actionError}</p><button type="button" onClick={() => setActionError("")} aria-label="Dismiss error">Dismiss</button></div> : null}

      {!reply ? <section className="no-reply-state"><FileText aria-hidden="true" /><div><h3>No reply is recorded for this application yet.</h3><p>The timeline above remains the record of activity currently stored in RTI Saathi. You can add a clearly marked demo reply for the prototype, or review the appeal-timing guidance below.</p></div></section> : <ReplyDocument application={application} />}

      {!reply ? <DemoReplyForm pending={operation === "attach"} onAttach={attach} /> : <details className="replace-reply"><summary>Replace this demo reply</summary><p>Adding another demo reply replaces the recorded reply. RTI Saathi also clears any earlier understanding or appeal draft so the case stays consistent.</p><DemoReplyForm pending={operation === "attach"} onAttach={attach} compact /></details>}

      {reply && !analysis ? <section className="understand-cta"><Sparkles aria-hidden="true" /><div><p>Reply recorded</p><h3>Understand what the department appears to have answered.</h3><p>RTI Saathi will compare this demo reply with every original question and identify information that may still be missing.</p><button className="button button--primary button--large" type="button" onClick={() => void analyse()} disabled={operation !== null}>Understand this reply</button></div></section> : null}

      {operation === "analyse" ? <div className="analysis-progress" role="status" aria-live="polite"><span /><div><strong>Reading the reply…</strong><p>Comparing it with your RTI questions and checking what may still be missing.</p></div></div> : null}

      {analysis ? <ReplyAnalysisView application={application} sectionRef={understandingRef} /> : null}

      <section className="appeal-guidance" aria-labelledby="appeal-guidance-title"><div className="case-section__heading"><Scale aria-hidden="true" /><div><p>What you can do next</p><h3 id="appeal-guidance-title">First appeal guidance</h3></div></div>{guidanceLoading ? <p className="guidance-loading" role="status" aria-live="polite">Checking the recorded application timeline…</p> : guidanceError ? <div className="guidance-error" role="alert"><p>We couldn’t load this part of your application.</p><button className="button button--secondary" type="button" onClick={() => void loadGuidance()}>Try again</button></div> : guidance ? <><div className={`guidance-verdict guidance-verdict--${guidance.status}`}><strong>{guidanceLabel(guidance.status)}</strong><p>{guidance.explanation}</p></div><dl className="guidance-facts"><div><dt>Days since application</dt><dd>{guidance.daysSinceSubmission}</dd></div><div><dt>Reply recorded</dt><dd>{guidance.responseReceived ? "Yes" : "No"}</dd></div><div><dt>Unanswered questions</dt><dd>{guidance.unansweredCount}</dd></div><div><dt>Partly answered</dt><dd>{guidance.partiallyAnsweredCount}</dd></div><div><dt>Fee required in this scope</dt><dd>{guidance.feeRequired ? "Yes" : "No"}</dd></div></dl><p className="legal-disclaimer"><Info aria-hidden="true" />{guidance.disclaimer}</p>{guidance.status === "not_yet_due" ? <p className="appeal-boundary">A draft cannot be prepared while this application is recorded as not yet due.</p> : guidance.status === "not_currently_recommended" ? <p className="appeal-boundary">RTI Saathi does not currently recommend generating a first appeal from this record.</p> : !analysis && reply ? <p className="appeal-boundary">Understand the reply first so any appeal grounds stay tied to unanswered, partly answered, or unclear questions.</p> : null}{draftPermitted && !application.firstAppealDraft ? <div className="prepare-appeal"><label htmlFor="citizen-appeal-notes">Optional notes for your draft</label><textarea id="citizen-appeal-notes" maxLength={2000} value={citizenNotes} onChange={(event) => setCitizenNotes(event.target.value)} placeholder="Add factual context you want considered. Do not add accusations or punitive requests." /><button className="button button--primary button--large" type="button" onClick={() => void draft()} disabled={operation !== null}><FilePenLine aria-hidden="true" />{operation === "draft" ? "Preparing draft…" : "Prepare a first appeal draft"}</button></div> : null}</> : null}</section>

      {application.firstAppealDraft ? <AppealDraftEditor key={`${application.id}-${application.firstAppealDraft.subject}`} draft={application.firstAppealDraft} /> : null}
    </section>
  );
}

function ReplyDocument({ application }: { application: RTIApplicationDetail }) {
  const reply = application.governmentReply!;
  return <article className="government-reply-document"><header><div><span>DEMO REPLY</span><h3>{reply.subject ?? "Government reply"}</h3></div><small>Prototype document</small></header><dl><div><dt>Received</dt><dd>{formatDate(reply.receivedAt, true)}</dd></div>{reply.referenceNumber ? <div><dt>Reference</dt><dd>{reply.referenceNumber}</dd></div> : null}{reply.officerName ? <div><dt>Officer</dt><dd>{reply.officerName}</dd></div> : null}{reply.officerDesignation ? <div><dt>Designation</dt><dd>{reply.officerDesignation}</dd></div> : null}</dl><div className="government-reply-body">{reply.body}</div>{reply.attachments.length ? <section><h4>Attachment metadata</h4><ul>{reply.attachments.map((attachment) => <li key={attachment.id}><strong>{attachment.fileName}</strong><span>{attachment.mimeType} · {formatBytes(attachment.sizeBytes)}{attachment.purpose ? ` · ${attachment.purpose}` : ""}</span></li>)}</ul></section> : null}<aside><Info aria-hidden="true" /><p><strong>This is a prototype reply.</strong>It is used to demonstrate how RTI Saathi can help interpret a response and does not come from a live government portal.</p></aside></article>;
}

function DemoReplyForm({ pending, onAttach, compact = false }: { pending: boolean; onAttach: (input: GovernmentReplyInput | { scenario: "pension_partial_reply" }) => Promise<void>; compact?: boolean }) {
  const [mode, setMode] = useState<"scenario" | "manual">("scenario");
  const [body, setBody] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [officerDesignation, setOfficerDesignation] = useState("");
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (mode === "manual" && !body.trim()) { setError("Enter the demo reply text."); return; }
    void onAttach(mode === "scenario" ? { scenario: "pension_partial_reply" } : { body: body.trim(), referenceNumber: referenceNumber.trim() || null, subject: subject.trim() || null, officerName: officerName.trim() || null, officerDesignation: officerDesignation.trim() || null, attachments: [] });
  }
  return <form className={`demo-reply-form${compact ? " demo-reply-form--compact" : ""}`} onSubmit={submit} noValidate><header><span>Demo feature</span><h3>Add a demo government reply</h3><p>This creates a prototype reply inside RTI Saathi. It does not fetch anything from a government portal.</p></header><fieldset><legend>Choose a supported reply option</legend><label><input type="radio" name={`reply-mode-${compact ? "compact" : "main"}`} checked={mode === "scenario"} onChange={() => setMode("scenario")} /><span><strong>Use prepared pension example</strong>A predefined partial-reply scenario included in this prototype.</span></label><label><input type="radio" name={`reply-mode-${compact ? "compact" : "main"}`} checked={mode === "manual"} onChange={() => setMode("manual")} /><span><strong>Enter demo reply text</strong>Record reply text and optional metadata for this prototype case.</span></label></fieldset>{mode === "manual" ? <div className="demo-reply-fields"><div className="field-group field-group--wide"><label htmlFor={`demo-reply-body-${compact}`}>Demo reply text</label><textarea id={`demo-reply-body-${compact}`} maxLength={20000} value={body} onChange={(event) => setBody(event.target.value)} /></div><div className="field-group"><label htmlFor={`demo-reply-subject-${compact}`}>Subject <span>(optional)</span></label><input id={`demo-reply-subject-${compact}`} maxLength={300} value={subject} onChange={(event) => setSubject(event.target.value)} /></div><div className="field-group"><label htmlFor={`demo-reply-reference-${compact}`}>Reference <span>(optional)</span></label><input id={`demo-reply-reference-${compact}`} maxLength={200} value={referenceNumber} onChange={(event) => setReferenceNumber(event.target.value)} /></div><div className="field-group"><label htmlFor={`demo-reply-officer-${compact}`}>Officer name <span>(optional)</span></label><input id={`demo-reply-officer-${compact}`} maxLength={200} value={officerName} onChange={(event) => setOfficerName(event.target.value)} /></div><div className="field-group"><label htmlFor={`demo-reply-designation-${compact}`}>Designation <span>(optional)</span></label><input id={`demo-reply-designation-${compact}`} maxLength={200} value={officerDesignation} onChange={(event) => setOfficerDesignation(event.target.value)} /></div></div> : null}{error ? <p className="field-error" role="alert">{error}</p> : null}<button className="button button--secondary button--large" type="submit" disabled={pending}>{pending ? "Adding demo reply…" : "Add demo reply"}</button></form>;
}

function ReplyAnalysisView({ application, sectionRef }: { application: RTIApplicationDetail; sectionRef: React.RefObject<HTMLElement | null> }) {
  const analysis = application.replyAnalysis!;
  const signals = [{ active: analysis.replySignals.transferMentioned, label: "The reply mentions a transfer." }, { active: analysis.replySignals.rejectionMentioned, label: "The reply mentions rejection." }, { active: analysis.replySignals.exemptionMentioned, label: "The reply mentions an exemption." }, { active: analysis.replySignals.recordsUnavailableMentioned, label: "The reply mentions unavailable records." }].filter((signal) => signal.active);
  return <section className="reply-understanding" id="reply-understanding" ref={sectionRef} tabIndex={-1} aria-labelledby="reply-understanding-title"><header><p>Understanding the reply</p><h3 id="reply-understanding-title">{overallUnderstanding(analysis.overallStatus)}</h3><span className={`assessment-label assessment-label--${analysis.overallStatus}`}><i aria-hidden="true" />{assessmentLabel(analysis.overallStatus)}</span><div>{analysis.summary}</div></header><section className="question-comparison" aria-labelledby="question-comparison-title"><h4 id="question-comparison-title">Question-by-question comparison</h4>{analysis.questionAssessments.map((assessment, index) => <article key={`${index}-${assessment.question}`}><span>Question {index + 1}</span><div className="comparison-block"><small>Original request</small><p>{assessment.question}</p></div><div className="comparison-arrow" aria-hidden="true">↓</div><div className="comparison-block comparison-block--finding"><small>What the reply appears to provide</small><p>{assessment.explanation}</p></div><div className="assessment-row"><strong>Assessment</strong><span className={`assessment-label assessment-label--${assessment.status}`}><i aria-hidden="true" />{assessmentLabel(assessment.status)}</span></div></article>)}</section><div className="information-columns"><section><h4>Key information found</h4>{analysis.keyInformation.length ? <ul>{analysis.keyInformation.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No key information was identified in the recorded reply.</p>}</section><section><h4>Information that may be missing</h4>{analysis.missingInformation.length ? <ul>{analysis.missingInformation.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No missing information was identified by the recorded analysis.</p>}</section></div>{signals.length ? <section className="reply-signals"><h4>Wording noticed in the reply</h4><ul>{signals.map((signal) => <li key={signal.label}>{signal.label}</li>)}</ul></section> : null}<aside className="analysis-next"><strong>Suggested next step</strong><p>{analysis.actionReason}</p></aside><p className="legal-disclaimer"><Info aria-hidden="true" />{analysis.disclaimer}</p></section>;
}

function AppealDraftEditor({ draft }: { draft: FirstAppealDraft }) {
  const [subject, setSubject] = useState(draft.subject);
  const [grounds, setGrounds] = useState(draft.grounds);
  const [relief, setRelief] = useState(draft.requestedRelief);
  const [closing, setClosing] = useState(draft.closingStatement);
  const [copyStatus, setCopyStatus] = useState("");
  function update(items: string[], index: number, value: string) { return items.map((item, itemIndex) => itemIndex === index ? value : item); }
  function renderedText() { return `FIRST APPEAL\n\nSubject: ${subject}\n\nTo:\n${draft.addressedTo.title}\n${draft.addressedTo.publicAuthorityName}\n\nOriginal RTI registration: ${draft.originalRegistrationNumber}\nApplication date: ${formatDate(draft.applicationDate)}\nReply date: ${draft.replyDate ? formatDate(draft.replyDate) : "No reply recorded"}\n\nGrounds:\n${grounds.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\nRelief requested:\n${relief.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\n${closing}\n\n${draft.disclaimer}\n\nThis draft has not been submitted to a government authority.`; }
  async function copy() { try { await navigator.clipboard.writeText(renderedText()); setCopyStatus("Appeal draft copied."); } catch { setCopyStatus("The draft could not be copied. Select the text and copy it manually."); } }
  return <section className="appeal-draft-shell" id="appeal-draft" tabIndex={-1} aria-labelledby="appeal-draft-title"><header><div><span>Editable local draft</span><h3 id="appeal-draft-title">First appeal</h3></div><div><button className="button button--secondary" type="button" onClick={() => void copy()}><Clipboard aria-hidden="true" />Copy appeal draft</button><button className="button button--secondary" type="button" onClick={() => window.print()}><Printer aria-hidden="true" />Print</button></div></header><div className="appeal-document"><p className="appeal-document__title">FIRST APPEAL</p><div className="field-group"><label htmlFor="appeal-subject">Subject</label><input id="appeal-subject" maxLength={300} value={subject} onChange={(event) => setSubject(event.target.value)} /></div><dl><div><dt>To</dt><dd><strong>{draft.addressedTo.title}</strong><br />{draft.addressedTo.publicAuthorityName}</dd></div><div><dt>Original RTI registration</dt><dd>{draft.originalRegistrationNumber}</dd></div><div><dt>Application date</dt><dd>{formatDate(draft.applicationDate)}</dd></div><div><dt>Reply date</dt><dd>{draft.replyDate ? formatDate(draft.replyDate) : "No reply recorded"}</dd></div></dl><fieldset><legend>Grounds</legend>{grounds.map((ground, index) => <label key={index} htmlFor={`appeal-ground-${index}`}><span>{index + 1}</span><textarea id={`appeal-ground-${index}`} maxLength={1000} value={ground} onChange={(event) => setGrounds((items) => update(items, index, event.target.value))} /></label>)}</fieldset><fieldset><legend>Relief requested</legend>{relief.map((item, index) => <label key={index} htmlFor={`appeal-relief-${index}`}><span>{index + 1}</span><textarea id={`appeal-relief-${index}`} maxLength={1000} value={item} onChange={(event) => setRelief((items) => update(items, index, event.target.value))} /></label>)}</fieldset><div className="field-group"><label htmlFor="appeal-closing">Closing statement</label><textarea id="appeal-closing" maxLength={1000} value={closing} onChange={(event) => setClosing(event.target.value)} /></div>{draft.warnings.length ? <div className="appeal-warnings"><strong>Review before using</strong><ul>{draft.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div> : null}<p className="legal-disclaimer"><Info aria-hidden="true" />{draft.disclaimer}</p><div className="submission-boundary"><AlertCircle aria-hidden="true" /><p><strong>This draft has not been submitted to a government authority.</strong>Your edits remain only on this page. RTI Saathi does not submit first appeals.</p></div></div><p className="sr-only" aria-live="polite">{copyStatus}</p>{copyStatus ? <p className="copy-status"><Check aria-hidden="true" />{copyStatus}</p> : null}</section>;
}
