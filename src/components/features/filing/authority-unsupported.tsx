import { ArrowLeft, Home, RotateCcw, ShieldOff } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";

export function AuthorityUnsupported({ onEdit, onStartOver }: { onEdit: () => void; onStartOver: () => void }) {
  return <section className="state-blocked" aria-labelledby="filing-step-title"><ShieldOff aria-hidden="true" /><p className="section-index">Authority not yet supported</p><h1 id="filing-step-title" tabIndex={-1}>This Central Government authority is not yet supported.</h1><p>We understand your issue, but RTI Saathi does not yet have a verified authority mapping for this Central Government service.</p><p>Your answer has been kept. You can edit the issue and try a different description, or return later when this authority is supported.</p><div className="state-blocked__actions"><button className="button button--primary button--large" type="button" onClick={onEdit}><ArrowLeft aria-hidden="true" /> Edit my issue</button><button className="button button--secondary button--large" type="button" onClick={onStartOver}><RotateCcw aria-hidden="true" /> Start over</button><Link href={routes.home}><Home aria-hidden="true" /> Return home</Link></div></section>;
}
