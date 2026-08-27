import { ArrowLeft, BookOpen, Home, MapPinOff } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";

export function StateBlocked({ onEdit }: { onEdit: () => void }) {
  return <section className="state-blocked" aria-labelledby="filing-step-title"><MapPinOff aria-hidden="true" /><p className="section-index">Current filing boundary</p><h1 id="filing-step-title" tabIndex={-1}>This State filing journey is not yet supported.</h1><p>RTI Saathi currently supports the complete guided filing journey for selected Central Government authorities. We don’t yet have verified filing rules for this State authority.</p><div className="state-blocked__actions"><button className="button button--primary button--large" type="button" onClick={onEdit}><ArrowLeft aria-hidden="true" /> Edit my issue</button><Link className="button button--secondary button--large" href={routes.learn}><BookOpen aria-hidden="true" /> Understand RTI</Link><Link href={routes.home}><Home aria-hidden="true" /> Return home</Link></div></section>;
}
