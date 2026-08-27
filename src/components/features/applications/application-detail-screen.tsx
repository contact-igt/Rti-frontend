"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Banknote, FileText, Landmark, RefreshCw, ShieldCheck, UserRound } from "lucide-react";
import { routes } from "@/config/routes";
import { getApplication } from "@/lib/api/rti";
import { ApiError } from "@/lib/api/client";
import { clearSession } from "@/lib/auth/session";
import { useDemoSession } from "@/lib/auth/use-session";
import { formatBytes, formatDate, maskEmail, maskPhone, statusLabel } from "@/lib/applications/presentation";
import type { RTIApplicationDetail } from "@/types/filing";
import { ApplicationTimeline } from "@/components/features/applications/application-timeline";
import { ReplyWorkflow } from "@/components/features/applications/reply-workflow";

function nextAction(application: RTIApplicationDetail) {
  if (application.firstAppealDraft) return { title: "Review your first appeal draft", body: "A server-backed draft is ready below. You can make local edits, copy it, or print it." };
  if (application.replyAnalysis) return { title: application.replyAnalysis.recommendedAction === "consider_first_appeal" ? "Review first appeal guidance" : "Review the reply understanding", body: application.replyAnalysis.actionReason };
  if (application.governmentReply) return { title: "Understand the recorded reply", body: "Compare the demo reply with each original RTI question before deciding what to do next." };
  if (application.status === "action_required") return { title: "Review this case", body: "This application has an update that needs your attention." };
  if (application.status === "completed") return { title: "Keep this case file", body: "No further action is recorded for this completed application." };
  return { title: "Review reply timing", body: "No reply is recorded yet. Check the first appeal timing guidance recorded for this case." };
}

export function ApplicationDetailScreen({ id }: { id: string }) {
  const session = useDemoSession();
  const router = useRouter();
  const pathname = usePathname();
  const [application, setApplication] = useState<RTIApplicationDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  const expireSession = useCallback(() => {
    clearSession();
    router.replace(`${routes.login}?next=${encodeURIComponent(pathname)}`);
  }, [pathname, router]);

  const refreshCanonical = useCallback(async () => {
    if (session.status !== "authenticated") return;
    const response = await getApplication(id, session.token);
    setApplication(response.data);
  }, [id, session.status, session.token]);

  useEffect(() => {
    if (session.status === "anonymous") {
      router.replace(`${routes.login}?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (session.status !== "authenticated") return;
    let active = true;
    getApplication(id, session.token).then((response) => { if (active) setApplication(response.data); }).catch((cause) => {
      if (!active) return;
      if (cause instanceof ApiError && (cause.status === 401 || cause.code === "SESSION_EXPIRED")) {
        expireSession();
      } else if (cause instanceof ApiError && cause.status === 404) setNotFound(true);
      else setError("We couldn’t load this case file. Please try again.");
    });
    return () => { active = false; };
  }, [expireSession, id, pathname, reload, router, session.status, session.token]);

  if (session.status === "error") return <main id="main-content" className="case-page"><div className="container"><section className="case-state" role="alert"><FileText aria-hidden="true" /><h1>Session check unavailable</h1><p>We couldn’t reach RTI Saathi to verify your session. Your saved session has not been cleared.</p><button className="button button--secondary" type="button" onClick={() => void session.refresh()}><RefreshCw aria-hidden="true" /> Try again</button></section></div></main>;
  if (session.status !== "authenticated") return <main id="main-content" className="case-page"><div className="container route-loading">Checking your session…</div></main>;
  if (notFound) return <main id="main-content" className="case-page"><div className="container"><section className="case-state"><FileText aria-hidden="true" /><h1>Application not found</h1><p>This case file does not exist or is not available to this account.</p><Link className="button button--secondary" href={routes.applications}><ArrowLeft aria-hidden="true" /> Back to My Applications</Link></section></div></main>;
  if (error) return <main id="main-content" className="case-page"><div className="container"><section className="case-state" role="alert"><FileText aria-hidden="true" /><h1>Case file unavailable</h1><p>{error}</p><button className="button button--secondary" type="button" onClick={() => { setError(""); setApplication(null); setReload((value) => value + 1); }}><RefreshCw aria-hidden="true" /> Try again</button></section></div></main>;
  if (!application) return <main id="main-content" className="case-page"><div className="container route-loading">Opening your case file…</div></main>;
  const action = nextAction(application);
  return (
    <main id="main-content" className="case-page">
      <div className="container case-detail">
        <Link className="back-link" href={routes.applications}><ArrowLeft aria-hidden="true" /> My Applications</Link>
        <header className="case-file-header"><div><p className="eyebrow"><span /> Private case file</p><span className={`status-badge status-badge--${application.status}`}>{statusLabel(application.status)}</span><h1>{application.draft.subject}</h1></div><dl><div><dt>Registration number</dt><dd>{application.registrationNumber}</dd></div><div><dt>Submitted</dt><dd>{formatDate(application.submittedAt, true)}</dd></div><div><dt>Public authority</dt><dd>{application.authority.authorityName}</dd></div></dl></header>
        <div className="prototype-case-note"><ShieldCheck aria-hidden="true" /><p><strong>RTI Saathi prototype record</strong>This case file records activity inside RTI Saathi. It is not proof of transmission to or acknowledgement by a government portal.</p></div>
        <div className="case-detail-grid">
          <div className="case-detail-main">
            <section className="case-section"><div className="case-section__heading"><FileText aria-hidden="true" /><div><p>Application</p><h2>RTI request draft</h2></div></div>{application.draft.context ? <p className="case-context">{application.draft.context}</p> : null}<ol className="draft-question-list">{application.draft.questions.map((question, index) => <li key={`${index}-${question}`}>{question}</li>)}</ol>{application.draft.warnings.length ? <div className="case-warning"><strong>Draft notes</strong><ul>{application.draft.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div> : null}</section>
            <ReplyWorkflow application={application} token={session.token} onCanonicalRefresh={refreshCanonical} onSessionExpired={expireSession} />
            <section className="case-section"><div className="case-section__heading"><Landmark aria-hidden="true" /><div><p>Progress</p><h2>Application timeline</h2></div></div><ApplicationTimeline events={application.timeline} /></section>
            <section className="case-section"><div className="case-section__heading"><FileText aria-hidden="true" /><div><p>Attachments</p><h2>Document metadata</h2></div></div>{application.documents.length ? <ul className="case-documents">{application.documents.map((document) => <li key={document.id}><span>{document.fileName}</span><small>{document.mimeType.replace("application/", "").replace("image/", "").toUpperCase()} · {formatBytes(document.sizeBytes)}{document.purpose ? ` · ${document.purpose}` : ""}</small></li>)}</ul> : <p className="empty-inline">No supporting document metadata was added.</p>}</section>
          </div>
          <aside className="case-detail-aside">
            <section className="next-action"><span>Next action</span><h2>{action.title}</h2><p>{action.body}</p><a href="#reply-workflow">Continue this case</a></section>
            <section className="case-summary-card"><UserRound aria-hidden="true" /><h2>Applicant summary</h2><dl><div><dt>Name</dt><dd>{application.applicant.fullName}</dd></div><div><dt>Email</dt><dd>{maskEmail(application.applicant.email)}</dd></div><div><dt>Phone</dt><dd>{maskPhone(application.applicant.phone)}</dd></div><div><dt>Location</dt><dd>{application.applicant.city}, {application.applicant.stateOrUt}</dd></div><div><dt>Fee category</dt><dd>{application.applicant.bplStatus === "yes" ? "BPL exemption" : "Standard fee"}</dd></div></dl><p>Full address and contact values are intentionally not displayed here.</p></section>
            <section className="case-summary-card"><Banknote aria-hidden="true" /><h2>Payment</h2><dl><div><dt>Status</dt><dd>{application.payment.status === "not_required" ? "Not required" : application.payment.status[0].toUpperCase() + application.payment.status.slice(1)}</dd></div><div><dt>Amount</dt><dd>₹{(application.payment.amountPaise / 100).toFixed(2)}</dd></div><div><dt>Mode</dt><dd>{application.payment.mode.replaceAll("_", " ")}</dd></div>{application.payment.transactionId ? <div><dt>Reference</dt><dd>••••{application.payment.transactionId.slice(-6)}</dd></div> : null}</dl></section>
          </aside>
        </div>
      </div>
    </main>
  );
}
