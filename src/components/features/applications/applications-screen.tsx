"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, FilePlus2, FolderOpen, RefreshCw } from "lucide-react";
import { applicationDetailPath, routes } from "@/config/routes";
import { listApplications } from "@/lib/api/rti";
import { clearSession } from "@/lib/auth/session";
import { useDemoSession } from "@/lib/auth/use-session";
import { formatDate, statusLabel } from "@/lib/applications/presentation";
import { ApiError } from "@/lib/api/client";
import type { ApplicationListItem } from "@/types/filing";

export function ApplicationsScreen() {
  const session = useDemoSession();
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<ApplicationListItem[] | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (session.status === "anonymous") {
      router.replace(`${routes.login}?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (session.status !== "authenticated") return;
    let active = true;
    listApplications(session.token).then((response) => { if (active) setItems(response.data); }).catch((cause) => {
      if (!active) return;
      if (cause instanceof ApiError && (cause.status === 401 || cause.code === "SESSION_EXPIRED")) {
        clearSession();
        router.replace(`${routes.login}?next=${encodeURIComponent(pathname)}`);
      } else setError("We couldn’t load your applications. Please try again.");
    });
    return () => { active = false; };
  }, [pathname, reload, router, session.status, session.token]);

  if (session.status === "error") return <main id="main-content" className="case-page"><div className="container"><section className="case-state" role="alert"><FolderOpen aria-hidden="true" /><h1>Session check unavailable</h1><p>We couldn’t reach RTI Saathi to verify your session. Your saved session has not been cleared.</p><button className="button button--secondary" type="button" onClick={() => void session.refresh()}><RefreshCw aria-hidden="true" /> Try again</button></section></div></main>;
  if (session.status !== "authenticated") return <main id="main-content" className="case-page"><div className="container route-loading">Checking your session…</div></main>;
  return (
    <main id="main-content" className="case-page">
      <div className="container">
        <header className="case-page-header"><div><p className="eyebrow"><span /> Your RTI journey</p><h1>My Applications</h1><p>A private record of the RTI requests created under your prototype citizen account.</p></div><Link className="button button--primary button--large" href={routes.start}><FilePlus2 aria-hidden="true" /> Start a new RTI</Link></header>
        <div className="case-boundary"><strong>Signed in as {session.user.displayName}</strong><span>Only applications linked to this signed-in account are shown here.</span></div>
        {error ? <section className="case-state" role="alert"><FolderOpen aria-hidden="true" /><h2>Applications could not be loaded</h2><p>{error}</p><button className="button button--secondary" type="button" onClick={() => { setError(""); setItems(null); setReload((value) => value + 1); }}><RefreshCw aria-hidden="true" /> Try again</button></section> : null}
        {!error && items === null ? <div className="application-loading" aria-live="polite"><span />Loading applications…</div> : null}
        {!error && items?.length === 0 ? <section className="case-state"><FolderOpen aria-hidden="true" /><h2>No applications yet</h2><p>When you complete the guided filing journey, the application will appear here.</p><Link className="button button--primary" href={routes.start}>Start your first RTI <ArrowRight aria-hidden="true" /></Link></section> : null}
        {!error && items && items.length > 0 ? <section aria-labelledby="application-list-title"><div className="list-heading"><h2 id="application-list-title">Case files</h2><span>{items.length} {items.length === 1 ? "application" : "applications"}</span></div><div className="application-list">{items.map((item) => <article className="application-card" key={item.id}><div className="application-card__top"><span className={`status-badge status-badge--${item.status}`}>{statusLabel(item.status)}</span><time dateTime={item.submittedAt}>{formatDate(item.submittedAt)}</time></div><h3>{item.subject}</h3><dl><div><dt>Registration number</dt><dd>{item.registrationNumber}</dd></div><div><dt>Public authority</dt><dd>{item.authorityName}</dd></div></dl><Link href={applicationDetailPath(item.id)} aria-label={`Open application: ${item.subject}`}>Open case file <ArrowRight aria-hidden="true" /></Link></article>)}</div></section> : null}
      </div>
    </main>
  );
}
