import { ArrowLeft, ArrowRight, FileText, Plus, Trash2 } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import type { RTIDraft, SelectedAuthority } from "@/types/filing";

export function DraftStep({ draft, authority, onBack, onChange, onContinue }: { draft: RTIDraft; authority: SelectedAuthority; onBack: () => void; onChange: (draft: RTIDraft) => void; onContinue: () => void }) {
  const [errors, setErrors] = useState<string[]>([]);
  const summaryRef = useRef<HTMLDivElement>(null);
  function update(values: Partial<RTIDraft>) { onChange({ ...draft, ...values }); }
  function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: string[] = [];
    if (!draft.subject.trim() || draft.subject.length > 200) nextErrors.push("Add a subject of no more than 200 characters.");
    if (draft.context && draft.context.length > 800) nextErrors.push("Shorten the context to 800 characters or fewer.");
    if (draft.questions.length < 3 || draft.questions.length > 7) nextErrors.push("Keep between 3 and 7 information questions.");
    if (draft.questions.some((question) => !question.trim() || question.length > 600)) nextErrors.push("Every question must contain text and be no more than 600 characters.");
    setErrors(nextErrors);
    if (!nextErrors.length) onContinue();
    else requestAnimationFrame(() => summaryRef.current?.focus());
  }
  return (
    <form className="filing-form" onSubmit={submit} noValidate>
      <div className="step-heading"><p className="section-index">Your RTI request</p><h1 id="filing-step-title" tabIndex={-1}>Review and edit your request.</h1><p>Ask for records, documents, status, file movement or recorded information. You remain in control of every word.</p></div>
      {errors.length ? <div className="validation-summary" role="alert" tabIndex={-1} ref={summaryRef}><strong>Please correct the request</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div> : null}
      <div className="rti-document">
        <header><FileText aria-hidden="true" /><div><span>RTI REQUEST</span><small>Editable working draft</small></div></header>
        <div className="document-field document-field--fixed"><span>To</span><strong>{authority.authorityName}</strong></div>
        <div className="document-field"><label htmlFor="draft-subject">Subject</label><input id="draft-subject" value={draft.subject} maxLength={200} onChange={(event) => update({ subject: event.target.value })} /><small>{draft.subject.length} / 200</small></div>
        <div className="document-field"><label htmlFor="draft-context">Context</label><textarea id="draft-context" value={draft.context ?? ""} maxLength={800} rows={5} onChange={(event) => update({ context: event.target.value || null })} /><small>{draft.context?.length ?? 0} / 800</small></div>
        <fieldset className="question-editor"><legend>Information requested</legend>{draft.questions.map((question, index) => <div key={index} className="question-row"><span>{index + 1}</span><div><label className="sr-only" htmlFor={`question-${index}`}>Question {index + 1}</label><textarea id={`question-${index}`} value={question} maxLength={600} rows={3} onChange={(event) => update({ questions: draft.questions.map((item, itemIndex) => itemIndex === index ? event.target.value : item) })} /><small>{question.length} / 600</small></div><button type="button" aria-label={`Remove question ${index + 1}`} disabled={draft.questions.length <= 3} onClick={() => update({ questions: draft.questions.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 aria-hidden="true" /></button></div>)}<button className="add-question" type="button" disabled={draft.questions.length >= 7} onClick={() => update({ questions: [...draft.questions, ""] })}><Plus aria-hidden="true" /> Add another question</button></fieldset>
        {draft.warnings.length ? <aside className="draft-warnings"><strong>Before you continue</strong><ul>{draft.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></aside> : null}
      </div>
      <div className="step-actions"><button className="button button--secondary button--large" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Change authority</button><button className="button button--primary button--large" type="submit">Continue to my details <ArrowRight aria-hidden="true" /></button></div>
    </form>
  );
}
