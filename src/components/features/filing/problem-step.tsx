import { ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";

const examples = [
  "My pension has been pending and I want to know where my file is.",
  "I want records showing how road repair funds were used in my area.",
  "I want to know the recorded status of my scholarship application.",
];

export function ProblemStep({ initialProblem, pending, onSubmit }: { initialProblem: string; pending: boolean; onSubmit: (problem: string) => void }) {
  const [problem, setProblem] = useState(initialProblem);
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = problem.trim();
    if (value.length < 10) { setError("Please describe the issue in at least 10 characters."); return; }
    if (value.length > 5000) { setError("Please shorten the description to 5,000 characters or fewer."); return; }
    setError("");
    onSubmit(value);
  }

  return (
    <form className="filing-form" onSubmit={submit} noValidate>
      <div className="step-heading"><p className="section-index">Your issue</p><h1 id="filing-step-title" tabIndex={-1}>What information are you trying to get?</h1><p>Write it in your own words. You don’t need to know the department or legal wording.</p></div>
      <div className="field-group">
        <label htmlFor="problem">Explain what happened and what you want to find out</label>
        <textarea id="problem" value={problem} onChange={(event) => setProblem(event.target.value)} rows={8} maxLength={5000} aria-describedby={`problem-help${error ? " problem-error" : ""}`} aria-invalid={Boolean(error)} autoFocus />
        <div className="field-meta"><span id="problem-help">Do not include passwords, bank details or identity numbers.</span><span>{problem.length} / 5,000</span></div>
        {error ? <p className="field-error" id="problem-error" role="alert">{error}</p> : null}
      </div>
      <div className="example-list"><p>Examples</p>{examples.map((example) => <button type="button" key={example} onClick={() => setProblem(example)}>{example}</button>)}</div>
      <div className="step-actions step-actions--end"><button className="button button--primary button--large" type="submit" disabled={pending}>{pending ? "Understanding your request…" : <>Understand my issue <ArrowRight aria-hidden="true" /></>}</button></div>
    </form>
  );
}
