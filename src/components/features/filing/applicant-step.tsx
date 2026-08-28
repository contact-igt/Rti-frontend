import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import type { RTIApplicant, SupportingDocument } from "@/types/filing";
import { DocumentsStep } from "./documents-step";

type ApplicantErrors = Partial<Record<keyof RTIApplicant | "documents", string>>;

export function ApplicantStep({ applicant, documents, pending, onBack, onApplicantChange, onDocumentsChange, onSubmit }: { applicant: RTIApplicant; documents: SupportingDocument[]; pending: boolean; onBack: () => void; onApplicantChange: (applicant: RTIApplicant) => void; onDocumentsChange: (documents: SupportingDocument[]) => void; onSubmit: () => void }) {
  const [errors, setErrors] = useState<ApplicantErrors>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  function set<K extends keyof RTIApplicant>(key: K, value: RTIApplicant[K]) { onApplicantChange({ ...applicant, [key]: value }); }
  function submit(event: FormEvent) {
    event.preventDefault();
    const next: ApplicantErrors = {};
    if (applicant.fullName.trim().length < 2 || applicant.fullName.length > 120) next.fullName = "Enter the applicant’s full name (2–120 characters).";
    if (applicant.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicant.email)) next.email = "Enter a valid email address or leave it blank.";
    const digits = applicant.phone?.replace(/\D/g, "") ?? "";
    if (applicant.phone && (digits.length < 7 || digits.length > 15 || !/^\+?[0-9 ()-]+$/.test(applicant.phone))) next.phone = "Enter a valid phone number with 7–15 digits or leave it blank.";
    if (applicant.addressLine1.trim().length < 5 || applicant.addressLine1.length > 250) next.addressLine1 = "Enter the main postal address (5–250 characters).";
    if (applicant.addressLine2 && applicant.addressLine2.length > 250) next.addressLine2 = "Shorten the additional address line to 250 characters.";
    if (applicant.city.trim().length < 2 || applicant.city.length > 100) next.city = "Enter the city or district.";
    if (applicant.stateOrUt.trim().length < 2 || applicant.stateOrUt.length > 100) next.stateOrUt = "Enter the State or Union Territory.";
    if (!/^[1-9][0-9]{5}$/.test(applicant.postalCode)) next.postalCode = "Enter a valid six-digit Indian PIN code.";
    if (!applicant.citizenshipConfirmed) next.citizenshipConfirmed = "Confirm Indian citizenship to continue.";
    if (applicant.bplStatus === "yes" && !documents.some((document) => /\b(bpl|below poverty)\b/i.test(`${document.fileName} ${document.purpose ?? ""}`))) next.documents = "Add document metadata clearly identified as BPL proof.";
    setErrors(next);
    if (Object.keys(next).length) { requestAnimationFrame(() => summaryRef.current?.focus()); return; }
    onSubmit();
  }
  const fieldError = (key: keyof ApplicantErrors) => errors[key] ? <p className="field-error" id={`${String(key)}-error`}>{errors[key]}</p> : null;
  return (
    <form className="filing-form" onSubmit={submit} noValidate>
      <div className="step-heading"><p className="section-index">Applicant details</p><h1 id="filing-step-title" tabIndex={-1}>Who is making this RTI request?</h1><p>Use the applicant’s postal details. Required fields are marked with “Required”.</p></div>
      {Object.keys(errors).length ? <div className="validation-summary" role="alert" tabIndex={-1} ref={summaryRef}><strong>Please correct these details</strong><ul>{Object.values(errors).map((error) => <li key={error}>{error}</li>)}</ul></div> : null}
      <div className="applicant-grid">
        <div className="field-group field-group--wide"><label htmlFor="full-name">Full name <span>Required</span></label><input id="full-name" value={applicant.fullName} onChange={(event) => set("fullName", event.target.value)} autoComplete="name" maxLength={120} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} />{fieldError("fullName")}</div>
        <div className="field-group"><label htmlFor="email">Email <span>Optional</span></label><input id="email" type="email" value={applicant.email ?? ""} onChange={(event) => set("email", event.target.value || null)} autoComplete="email" maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />{fieldError("email")}</div>
        <div className="field-group"><label htmlFor="phone">Phone <span>Optional</span></label><input id="phone" type="tel" value={applicant.phone ?? ""} onChange={(event) => set("phone", event.target.value || null)} autoComplete="tel" inputMode="tel" maxLength={25} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} />{fieldError("phone")}</div>
        <div className="field-group field-group--wide"><label htmlFor="address-line-1">Postal address <span>Required</span></label><input id="address-line-1" value={applicant.addressLine1} onChange={(event) => set("addressLine1", event.target.value)} autoComplete="address-line1" maxLength={250} aria-invalid={Boolean(errors.addressLine1)} aria-describedby={errors.addressLine1 ? "addressLine1-error" : undefined} />{fieldError("addressLine1")}</div>
        <div className="field-group field-group--wide"><label htmlFor="address-line-2">Additional address line <span>Optional</span></label><input id="address-line-2" value={applicant.addressLine2 ?? ""} onChange={(event) => set("addressLine2", event.target.value || null)} autoComplete="address-line2" maxLength={250} aria-invalid={Boolean(errors.addressLine2)} aria-describedby={errors.addressLine2 ? "addressLine2-error" : undefined} />{fieldError("addressLine2")}</div>
        <div className="field-group"><label htmlFor="city">City or district <span>Required</span></label><input id="city" value={applicant.city} onChange={(event) => set("city", event.target.value)} autoComplete="address-level2" maxLength={100} aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? "city-error" : undefined} />{fieldError("city")}</div>
        <div className="field-group"><label htmlFor="state-or-ut">State or Union Territory <span>Required</span></label><input id="state-or-ut" value={applicant.stateOrUt} onChange={(event) => set("stateOrUt", event.target.value)} autoComplete="address-level1" maxLength={100} aria-invalid={Boolean(errors.stateOrUt)} aria-describedby={errors.stateOrUt ? "stateOrUt-error" : undefined} />{fieldError("stateOrUt")}</div>
        <div className="field-group"><label htmlFor="postal-code">PIN code <span>Required</span></label><input id="postal-code" value={applicant.postalCode} onChange={(event) => set("postalCode", event.target.value.replace(/\D/g, "").slice(0, 6))} autoComplete="postal-code" inputMode="numeric" maxLength={6} aria-invalid={Boolean(errors.postalCode)} aria-describedby={errors.postalCode ? "postalCode-error" : undefined} />{fieldError("postalCode")}</div>
        <div className="field-group"><span className="field-group__label">Country</span><p className="fixed-field">India</p></div>
      </div>
      <fieldset className="citizenship-field"><legend>Citizenship confirmation</legend><p>RTI applications under the RTI Act are available to Indian citizens.</p><label><input type="checkbox" checked={applicant.citizenshipConfirmed} onChange={(event) => set("citizenshipConfirmed", event.target.checked)} aria-invalid={Boolean(errors.citizenshipConfirmed)} aria-describedby={errors.citizenshipConfirmed ? "citizenshipConfirmed-error" : undefined} /><span><ShieldCheck aria-hidden="true" /> I confirm that the applicant is an Indian citizen.</span></label>{fieldError("citizenshipConfirmed")}</fieldset>
      <fieldset className="choice-field bpl-field"><legend>Are you applying under Below Poverty Line (BPL) status?</legend><label><input type="radio" name="bpl" checked={applicant.bplStatus === "no"} onChange={() => set("bplStatus", "no")} /><span><strong>No</strong><small>RTI Saathi will apply the standard prototype filing fee.</small></span></label><label><input type="radio" name="bpl" checked={applicant.bplStatus === "yes"} onChange={() => set("bplStatus", "yes")} /><span><strong>Yes</strong><small>RTI Saathi does not verify eligibility. BPL proof metadata is required for this prototype.</small></span></label></fieldset>
      <DocumentsStep documents={documents} bplRequired={applicant.bplStatus === "yes"} onChange={onDocumentsChange} />
      {fieldError("documents")}
      <div className="step-actions"><button className="button button--secondary button--large" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Back to request</button><button className="button button--primary button--large" type="submit" disabled={pending}>{pending ? "Checking your details…" : <>Review my RTI <ArrowRight aria-hidden="true" /></>}</button></div>
    </form>
  );
}
