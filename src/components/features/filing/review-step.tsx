import { ArrowLeft, ArrowRight, CheckCircle2, Edit3, FileCheck2 } from "lucide-react";
import type { FilingReview } from "@/types/filing";

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return <section className="review-section"><header><h2>{title}</h2><button type="button" onClick={onEdit}><Edit3 aria-hidden="true" /> Edit<span className="sr-only"> {title}</span></button></header><div>{children}</div></section>;
}

export function ReviewStep({ review, pending, onBack, onEdit, onContinue }: { review: FilingReview; pending: boolean; onBack: () => void; onEdit: (step: "problem" | "authority" | "draft" | "applicant") => void; onContinue: () => void }) {
  return (
    <section className="step-panel" aria-labelledby="filing-step-title">
      <div className="step-heading"><p className="section-index">Final review</p><h1 id="filing-step-title" tabIndex={-1}>Check the complete request before submission.</h1><p>Nothing has been submitted. Review each section and use Edit to correct anything that does not look right.</p></div>
      <div className="review-document"><div className="review-document__masthead"><FileCheck2 aria-hidden="true" /><div><span>RTI FILING REVIEW</span><small>Citizen-reviewed working document</small></div></div>
        <ReviewSection title="Your issue" onEdit={() => onEdit("problem")}><p>{review.problem}</p></ReviewSection>
        <ReviewSection title="Public authority" onEdit={() => onEdit("authority")}><strong>{review.authority.authorityName}</strong><p>Central Government authority</p></ReviewSection>
        <ReviewSection title="Your RTI request" onEdit={() => onEdit("draft")}><h3>{review.draft.subject}</h3>{review.draft.context ? <p>{review.draft.context}</p> : null}<ol>{review.draft.questions.map((question) => <li key={question}>{question}</li>)}</ol></ReviewSection>
        <ReviewSection title="Your details" onEdit={() => onEdit("applicant")}><strong>{review.applicant.fullName}</strong><p>{review.applicant.addressLine1}{review.applicant.addressLine2 ? `, ${review.applicant.addressLine2}` : ""}<br />{review.applicant.city}, {review.applicant.stateOrUt} — {review.applicant.postalCode}</p><small>Indian citizenship confirmed</small></ReviewSection>
        <ReviewSection title="Documents" onEdit={() => onEdit("applicant")}><p>{review.documents.length ? `${review.documents.length} metadata record${review.documents.length === 1 ? "" : "s"} added. Actual files are not uploaded in this prototype.` : "No supporting document metadata added."}</p>{review.documents.length ? <ul className="compact-list">{review.documents.map((document) => <li key={document.id}>{document.fileName} — {document.purpose || "Supporting document"}</li>)}</ul> : null}</ReviewSection>
        <section className="review-section fee-review"><header><h2>Fee / BPL status</h2></header><div><CheckCircle2 aria-hidden="true" /><p><strong>{review.feeStatus === "bpl_exempt" ? "BPL fee exemption" : "Standard filing fee"}</strong><span>{review.feeStatus === "bpl_exempt" ? "This review is marked as fee-exempt, subject to BPL proof metadata." : "RTI Saathi will create a ₹10 demo payment step after sign-in."}</span></p></div></section>
      </div>
      <div className="review-confirmation"><CheckCircle2 aria-hidden="true" /><p><strong>You will review once more before final submission.</strong> Signing in and the prototype payment or exemption step come next.</p></div>
      <div className="step-actions"><button className="button button--secondary button--large" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Back to details</button><button className="button button--primary button--large" type="button" onClick={onContinue} disabled={pending}>{pending ? "Checking your session…" : <>Sign in and continue <ArrowRight aria-hidden="true" /></>}</button></div>
    </section>
  );
}
