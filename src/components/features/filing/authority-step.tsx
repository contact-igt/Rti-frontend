import { ArrowLeft, ArrowRight, Building2, CircleCheck } from "lucide-react";
import { useState } from "react";
import type { AuthorityOption, AuthorityResolution } from "@/types/filing";

export function AuthorityStep({ resolution, selectedId, pending, onBack, onConfirm }: { resolution: Extract<AuthorityResolution, { status: "recommended" }>; selectedId?: string; pending: boolean; onBack: () => void; onConfirm: (authority: AuthorityOption) => void }) {
  const options = [resolution.recommendation, ...resolution.recommendation.alternatives];
  const [choice, setChoice] = useState(selectedId ?? options[0].authorityId);
  const selected = options.find((option) => option.authorityId === choice) ?? options[0];
  return (
    <section className="step-panel" aria-labelledby="filing-step-title">
      <div className="step-heading"><p className="section-index">Likely public authority</p><h1 id="filing-step-title" tabIndex={-1}>Choose the authority that appears most relevant.</h1><p>This recommendation is based on the information you provided. It is not a guarantee, and you make the final choice.</p></div>
      <fieldset className="authority-options"><legend className="sr-only">Choose a public authority</legend>{options.map((option, index) => <label key={option.authorityId} className={choice === option.authorityId ? "is-selected" : ""}><input type="radio" name="authority" value={option.authorityId} checked={choice === option.authorityId} onChange={() => setChoice(option.authorityId)} /><span className="authority-option__icon"><Building2 aria-hidden="true" /></span><span className="authority-option__copy"><small>{index === 0 ? "Recommended" : "Another possible authority"}</small><strong>{option.authorityName}</strong>{option.department ? <em>{option.department}</em> : null}<p>{option.reason}</p><span><CircleCheck aria-hidden="true" /> Central Government authority</span></span></label>)}</fieldset>
      <div className="step-actions"><button className="button button--secondary button--large" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Back</button><button className="button button--primary button--large" type="button" disabled={pending} onClick={() => onConfirm(selected)}>{pending ? "Preparing your request…" : <>Use this authority <ArrowRight aria-hidden="true" /></>}</button></div>
    </section>
  );
}
