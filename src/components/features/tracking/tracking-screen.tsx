"use client";

import { FormEvent, useState } from "react";
import { Search, ShieldCheck, Waypoints } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { trackApplication } from "@/lib/api/rti";
import { ApiError } from "@/lib/api/client";
import { formatDate, statusLabel } from "@/lib/applications/presentation";
import type { ApplicationTrackingView } from "@/types/filing";
import { ApplicationTimeline } from "@/components/features/applications/application-timeline";

function safePrefill(value: string | null) {
  const normalized = value?.trim().toUpperCase() ?? "";
  return /^[A-Z0-9-]{1,100}$/.test(normalized) ? normalized : "";
}

export function TrackingScreen() {
  const searchParams = useSearchParams();
  const [registration, setRegistration] = useState(() => safePrefill(searchParams.get("registration")));
  const [result, setResult] = useState<ApplicationTrackingView | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const normalized = registration.trim().toUpperCase();
    if (!/^[A-Z0-9-]{4,100}$/.test(normalized)) {
      setError("Enter a valid RTI Saathi registration number."); setResult(null); return;
    }
    setPending(true); setError(""); setResult(null);
    try {
      const response = await trackApplication(normalized);
      setRegistration(normalized); setResult(response.data);
    } catch (cause) {
      setError(cause instanceof ApiError && cause.status === 404 ? "No application was found for that registration number. Check the number and try again." : "We couldn’t check this registration number right now. Please try again.");
    } finally { setPending(false); }
  }

  return (
    <main id="main-content" className="tracking-page">
      <section className="tracking-hero"><div className="container tracking-hero__grid"><div><p className="eyebrow"><span /> Public status lookup</p><h1>Track an RTI Saathi application.</h1><p>Use the shareable registration number from your RTI Saathi receipt. You do not need to sign in.</p></div><div className="tracking-privacy"><ShieldCheck aria-hidden="true" /><div><strong>Privacy-safe by design</strong><p>This lookup shows only the subject, authority, status, submission date, and recorded timeline. Applicant, contact, document, payment, and reply details stay private.</p></div></div></div></section>
      <section className="tracking-workspace"><div className="container tracking-column"><form className="tracking-form" onSubmit={submit} noValidate><label htmlFor="registration-number">Registration number</label><p>For example: RTISAATHI-DEMO-2026-000001</p><div><input id="registration-number" value={registration} onChange={(event) => setRegistration(event.target.value)} autoComplete="off" spellCheck={false} placeholder="RTISAATHI-DEMO-YYYY-000000" aria-describedby={error ? "tracking-error" : undefined} /><button className="button button--primary button--large" type="submit" disabled={pending}><Search aria-hidden="true" />{pending ? "Checking…" : "Check status"}</button></div>{error ? <p className="tracking-error" id="tracking-error" role="alert">{error}</p> : null}</form>
        {result ? <article className="tracking-result" aria-live="polite"><header><div><p>Status found</p><h2>{result.subject}</h2><span>{result.registrationNumber}</span></div><span className={`status-badge status-badge--${result.status}`}>{statusLabel(result.status)}</span></header><dl className="tracking-facts"><div><dt>Public authority</dt><dd>{result.authority.authorityName}</dd></div><div><dt>Jurisdiction</dt><dd>{result.authority.jurisdiction === "central" ? "Central Government" : "State Government"}</dd></div><div><dt>Submitted</dt><dd>{formatDate(result.submittedAt, true)}</dd></div></dl><section><div className="case-section__heading"><Waypoints aria-hidden="true" /><div><p>Recorded progress</p><h3>Application timeline</h3></div></div><ApplicationTimeline events={result.timeline} /></section><aside><strong>Prototype status only</strong><p>These updates are recorded inside RTI Saathi and do not represent a live government portal status.</p></aside></article> : <div className="tracking-empty"><Waypoints aria-hidden="true" /><p>Your privacy-safe status timeline will appear here after a successful lookup.</p></div>}
      </div></section>
    </main>
  );
}
