"use client";

import { Check, Clipboard, FileCheck2, Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { routes } from "@/config/routes";
import type { CreatedApplication, RTIReceipt } from "@/types/filing";

export function ReceiptStep({ receipt, application }: { receipt: RTIReceipt; application: CreatedApplication }) {
  const [copied, setCopied] = useState(false);
  async function copy() { await navigator.clipboard.writeText(receipt.registrationNumber); setCopied(true); window.setTimeout(() => setCopied(false), 2500); }
  return (
    <section className="receipt" aria-labelledby="filing-step-title">
      <div className="receipt__status"><FileCheck2 aria-hidden="true" /><span>Application created</span></div>
      <h1 id="filing-step-title" tabIndex={-1}>Your RTI Saathi application is ready.</h1>
      <p className="receipt__lead">Keep the registration number below. This confirms creation inside RTI Saathi, not acknowledgement by a government authority.</p>
      <div className="receipt-document"><header><span>RTI SAATHI RECEIPT</span><small>Prototype acknowledgement</small></header><div className="registration-block"><span>Registration number</span><strong>{receipt.registrationNumber}</strong><button type="button" onClick={copy}>{copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}{copied ? "Registration number copied" : "Copy registration number"}</button><p className="sr-only" aria-live="polite">{copied ? "Registration number copied." : ""}</p></div><dl><div><dt>Subject</dt><dd>{application.draft.subject}</dd></div><div><dt>Authority</dt><dd>{receipt.authorityName}</dd></div><div><dt>Submission date</dt><dd>{new Date(receipt.submittedAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}</dd></div><div><dt>Current status</dt><dd>Submitted to RTI Saathi</dd></div></dl><aside><strong>Prototype notice</strong><p>{receipt.prototypeNotice}</p></aside></div>
      <div className="receipt-actions"><Link className="button button--primary button--large" href={routes.applications}>View My Applications</Link><Link className="button button--secondary button--large" href={`${routes.track}?registration=${encodeURIComponent(receipt.registrationNumber)}`}>Track application</Link><Link className="receipt-home" href={routes.home}><Home aria-hidden="true" /> Return home</Link></div>
    </section>
  );
}
