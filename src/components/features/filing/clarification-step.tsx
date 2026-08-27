import { ArrowLeft, ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";
import type { ClarificationState, RTIJurisdiction } from "@/types/filing";

export function ClarificationStep({ clarification, pending, onBack, onSubmit }: { clarification: NonNullable<ClarificationState>; pending: boolean; onBack: () => void; onSubmit: (answer: { text?: string; jurisdiction?: RTIJurisdiction; state?: string }) => void }) {
  const [text, setText] = useState(clarification.answer?.text ?? "");
  const [jurisdiction, setJurisdiction] = useState<RTIJurisdiction>(clarification.answer?.jurisdiction ?? "unknown");
  const [stateName, setStateName] = useState(clarification.answer?.state ?? "");
  const [error, setError] = useState("");
  const asksJurisdiction = clarification.jurisdiction === "unknown" && clarification.source === "authority";

  function submit(event: FormEvent) {
    event.preventDefault();
    if (asksJurisdiction) {
      if (jurisdiction === "unknown") { setError("Choose Central Government or State Government."); return; }
      if (jurisdiction === "state" && stateName.trim().length < 2) { setError("Enter the State or Union Territory."); return; }
      onSubmit({ jurisdiction, state: jurisdiction === "state" ? stateName.trim() : undefined });
      return;
    }
    if (text.trim().length < 2) { setError("Please add the detail requested above."); return; }
    onSubmit({ text: text.trim() });
  }

  return (
    <form className="filing-form" onSubmit={submit} noValidate>
      <div className="step-heading"><p className="section-index">One more detail</p><h1 id="filing-step-title" tabIndex={-1}>We need one more detail.</h1><p className="clarification-question">{clarification.question}</p></div>
      {asksJurisdiction ? (
        <fieldset className="choice-field"><legend>Which level of government handles this matter?</legend><label><input type="radio" name="jurisdiction" value="central" checked={jurisdiction === "central"} onChange={() => setJurisdiction("central")} /> <span><strong>Central Government</strong><small>For example: railways, income tax, central pensions or passport services</small></span></label><label><input type="radio" name="jurisdiction" value="state" checked={jurisdiction === "state"} onChange={() => setJurisdiction("state")} /> <span><strong>State Government</strong><small>For example: municipality, State department, local roads or State schemes</small></span></label></fieldset>
      ) : <div className="field-group"><label htmlFor="clarification-answer">Your answer</label><textarea id="clarification-answer" value={text} onChange={(event) => setText(event.target.value)} rows={4} autoFocus /></div>}
      {jurisdiction === "state" && asksJurisdiction ? <div className="field-group"><label htmlFor="state-name">State or Union Territory</label><input id="state-name" value={stateName} onChange={(event) => setStateName(event.target.value)} autoComplete="address-level1" /></div> : null}
      {error ? <p className="field-error" role="alert">{error}</p> : null}
      <div className="step-actions"><button className="button button--secondary button--large" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Back</button><button className="button button--primary button--large" type="submit" disabled={pending}>{pending ? "Checking this detail…" : <>Continue <ArrowRight aria-hidden="true" /></>}</button></div>
    </form>
  );
}
