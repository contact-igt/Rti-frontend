import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleAlert,
  FileCheck2,
  FileText,
  Landmark,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { routes } from "@/config/routes";
import { homeContent } from "@/content/home";
import { ProblemEntry } from "./problem-entry";

function SectionIntro({ id, index, eyebrow, title, description }: { id: string; index: string; eyebrow: string; title: string; description?: string }) {
  return (
    <header className="section-intro">
      <div className="section-intro__label"><span>{index}</span><p>{eyebrow}</p></div>
      <div>
        <h2 id={id}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </header>
  );
}

export function HomePage() {
  return (
    <main id="main-content">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-grid container">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Your right to information, made easier.</p>
            <h1 id="hero-title">You explain the problem.<br /><em>We help shape the right RTI.</em></h1>
            <p className="hero-copy__support">Describe the information you are trying to get from a public authority. RTI Saathi helps you understand the issue, identify the appropriate authority, prepare a clear request and follow what happens next.</p>
            <div className="hero-actions">
              <ButtonLink className="button--large" href={routes.start}>Start with my problem <ArrowRight aria-hidden="true" /></ButtonLink>
              <ButtonLink variant="text" href={routes.learn}>Understand RTI first</ButtonLink>
            </div>
            <p className="trust-note"><ShieldCheck aria-hidden="true" /> Independent assistance tool. Not a government website.</p>
          </div>
          <aside className="hero-document" aria-label="How RTI Saathi simplifies your concern">
            <div className="document-topline"><span>Citizen concern</span><span>Plain language</span></div>
            <p className="document-quote">“My scholarship has not arrived. I don’t know which office has my file.”</p>
            <div className="document-path" aria-hidden="true">
              <span><Search /> Understand</span>
              <i />
              <span><Landmark /> Find authority</span>
              <i />
              <span><FileCheck2 /> Prepare request</span>
            </div>
            <div className="document-result"><FileText aria-hidden="true" /><div><small>Clear information request</small><strong>Ask for file status, movement dates and recorded action.</strong></div></div>
          </aside>
        </div>
        <div className="container hero-entry"><ProblemEntry /></div>
      </section>

      <section className="section section--paper" aria-labelledby="what-is-rti">
        <div className="container">
          <SectionIntro id="what-is-rti" index="01" eyebrow="RTI, in ordinary language" title="A legal way to ask for information the government holds." description="The Right to Information Act, 2005 gives Indian citizens a way to request records and information from public authorities. It helps make public work visible and accountable." />
          <div className="definition-grid">
            <blockquote><span>RTI is a right to information —</span> not a test of your legal knowledge.</blockquote>
            <div>
              <p className="list-label">You can ask for</p>
              <ul className="ruled-list">
                {homeContent.rtiCanAskFor.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section help-find" aria-labelledby="what-rti-finds">
        <div className="container">
          <SectionIntro id="what-rti-finds" index="02" eyebrow="What RTI can reveal" title="Ask for the record behind the problem." description="A useful RTI usually asks for material that already exists: a file note, register entry, order, report, status or official communication." />
          <div className="question-ledger">
            <div><span>01</span><p>Where is my file?</p><small>Movement dates, current office and status on record</small></div>
            <div><span>02</span><p>What action was taken?</p><small>File notes, orders and recorded decisions</small></div>
            <div><span>03</span><p>Who handled it?</p><small>Names and designations available in the record</small></div>
            <div><span>04</span><p>What work was approved?</p><small>Sanctions, estimates, bills and inspection reports</small></div>
          </div>
        </div>
      </section>

      <section className="section section--ink" aria-labelledby="start-problem">
        <div className="container start-statement">
          <span className="section-index section-index--light">03 / Start with your problem</span>
          <h2 id="start-problem">You do not need to know the department, the officer or the legal wording.</h2>
          <div><p>Tell us what happened and what you want to find out. We help separate the grievance from the information that can be requested.</p><ButtonLink className="button--light button--large" href={routes.start}>Describe my problem <ArrowRight aria-hidden="true" /></ButtonLink></div>
        </div>
      </section>

      <section className="section process-section" aria-labelledby="how-it-works">
        <div className="container">
          <SectionIntro id="how-it-works" index="04" eyebrow="How RTI Saathi works" title="One clear path from your problem to the next step." description="The process stays understandable. You remain in control and review what is prepared before anything moves ahead." />
          <ol className="process-rail">
            {homeContent.process.map((step) => (
              <li key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.detail}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--paper" aria-labelledby="real-life">
        <div className="container">
          <SectionIntro id="real-life" index="05" eyebrow="Real-life situations" title="What could RTI help you find?" description="Start with a familiar situation. The useful question is often about the record, status or decision behind it." />
          <div className="use-case-table">
            {homeContent.useCases.map((useCase, index) => (
              <article key={useCase.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{useCase.title}</h3><p>{useCase.prompt}</p><ArrowRight aria-hidden="true" /></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section rights-section" aria-labelledby="rti-act">
        <div className="container rights-grid">
          <div className="act-document">
            <div><span>Act No. 22 of 2005</span><span>Citizen guide</span></div>
            <Landmark aria-hidden="true" />
            <p>THE RIGHT TO<br />INFORMATION ACT</p>
            <strong>2005</strong>
            <small>A plain-language introduction — not a reproduction of the legislation.</small>
          </div>
          <div className="rights-copy">
            <span className="section-index">06 / Know the Act</span>
            <h2 id="rti-act">The law gives you the right. Understanding it should not require a lawyer.</h2>
            <p>Learn who can file, which bodies are covered, what timelines usually apply, what information may be exempt, and when an appeal may be available.</p>
            <ButtonLink variant="secondary" href={routes.learn}>Understand your RTI rights <ArrowRight aria-hidden="true" /></ButtonLink>
          </div>
        </div>
      </section>

      <section className="section distinction" aria-labelledby="not-grievance">
        <div className="container">
          <SectionIntro id="not-grievance" index="07" eyebrow="RTI and grievances" title="RTI asks for the record. It does not directly order a solution." />
          <div className="comparison">
            <div className="comparison__yes"><p><Check aria-hidden="true" /> RTI helps you ask</p><ul><li>What records exist?</li><li>What action was recorded?</li><li>Where is my file?</li><li>Who handled it?</li></ul></div>
            <div className="comparison__no"><p><CircleAlert aria-hidden="true" /> RTI is not primarily</p><ul><li>“Fix this immediately.”</li><li>“Punish this officer.”</li><li>“Approve my application.”</li><li>A substitute for every grievance channel.</li></ul></div>
          </div>
          <p className="distinction-note">An RTI reply can still help: the official record may show what happened, what is pending, and which next step makes sense.</p>
        </div>
      </section>

      <section className="section trust-section" aria-labelledby="trust-boundaries">
        <div className="container trust-grid">
          <div><span className="section-index section-index--light">08 / Clear boundaries</span><h2 id="trust-boundaries">Helpful guidance, with no false promises.</h2></div>
          <div className="trust-points">
            <p><ShieldCheck aria-hidden="true" /><span><strong>Independent</strong>RTI Saathi is not a government website or a law firm.</span></p>
            <p><FileCheck2 aria-hidden="true" /><span><strong>You review first</strong>You remain responsible for checking the request before filing.</span></p>
            <p><MapPin aria-hidden="true" /><span><strong>Guidance, not guarantees</strong>We help you prepare and understand; outcomes depend on the public authority and the law.</span></p>
            <p><CircleAlert aria-hidden="true" /><span><strong>Prototype boundaries</strong>Some submission and status features may be demonstrations until official integrations are available.</span></p>
          </div>
        </div>
      </section>

      <section className="section tracking-section" aria-labelledby="already-started">
        <div className="container tracking-grid">
          <div><span className="section-index">09 / Continue</span><h2 id="already-started">Already have an RTI Saathi application?</h2><p>Use your application reference to check its recorded status, or return to your saved applications.</p></div>
          <div className="tracking-actions"><ButtonLink className="button--large" href={routes.track}>Track an application <ArrowRight aria-hidden="true" /></ButtonLink><ButtonLink variant="secondary" className="button--large" href={routes.applications}>My Applications</ButtonLink></div>
        </div>
      </section>

      <section className="final-cta" aria-labelledby="final-title">
        <div className="container final-cta__inner">
          <span>10 / Your right. Your question.</span>
          <h2 id="final-title">Start with what you need to know.</h2>
          <p>No legal language needed. Explain the problem and take the next step with clarity.</p>
          <ButtonLink className="button--light button--large" href={routes.start}>Start with my problem <ArrowRight aria-hidden="true" /></ButtonLink>
        </div>
      </section>
    </main>
  );
}
