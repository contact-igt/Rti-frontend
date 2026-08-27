import { ArrowLeft, ArrowRight, CheckCircle2, Info } from "lucide-react";
import type { ResponseMeta, RTIAnalysis } from "@/types/filing";

export function AnalysisStep({ analysis, meta, pending, onContinue, onEdit }: { analysis: RTIAnalysis; meta: ResponseMeta | null; pending: boolean; onContinue: () => void; onEdit: () => void }) {
  const jurisdiction = analysis.jurisdiction === "central" ? "a Central Government authority" : analysis.jurisdiction === "state" ? "a State Government authority" : "an authority that needs one more detail";
  return (
    <section className="step-panel" aria-labelledby="filing-step-title">
      <div className="step-heading"><p className="section-index">What we understood</p><h1 id="filing-step-title" tabIndex={-1}>We understood that you’re looking for:</h1></div>
      <ul className="understanding-list">{analysis.informationNeeded.map((item) => <li key={item}><CheckCircle2 aria-hidden="true" /><span>{item}</span></li>)}</ul>
      <div className="finding-note"><span>Likely area</span><strong>{analysis.issueType}</strong><p>This appears to involve {jurisdiction}. We’ll help narrow it down, but you will confirm the authority.</p></div>
      {meta?.degraded ? <p className="standard-guidance"><Info aria-hidden="true" /> RTI Saathi used its standard guidance for this step.</p> : null}
      <div className="step-actions"><button className="button button--secondary button--large" type="button" onClick={onEdit}><ArrowLeft aria-hidden="true" /> Edit my issue</button><button className="button button--primary button--large" type="button" onClick={onContinue} disabled={pending}>{pending ? "Checking the likely authority…" : <>Continue <ArrowRight aria-hidden="true" /></>}</button></div>
    </section>
  );
}
