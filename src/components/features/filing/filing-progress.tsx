import type { FilingStage } from "@/types/filing";

const steps = ["Your issue", "Authority", "RTI request", "Your details", "Review", "Submit"] as const;

const progressByStage: Record<FilingStage, number> = {
  problem: 0, analysis: 0, clarification: 0, "authority-unsupported": 0, "state-blocked": 0,
  authority: 1, draft: 2, applicant: 3, review: 4, auth: 5, payment: 5, receipt: 5,
};

export function FilingProgress({ stage }: { stage: FilingStage }) {
  const current = progressByStage[stage];
  return (
    <nav className="filing-progress" aria-label="RTI preparation progress">
      <p>Step {current + 1} of {steps.length}: <strong>{steps[current]}</strong></p>
      <ol>
        {steps.map((step, index) => (
          <li key={step} className={index < current ? "is-complete" : index === current ? "is-current" : ""} aria-current={index === current ? "step" : undefined}>
            <span>{index + 1}</span><small>{step}</small>
          </li>
        ))}
      </ol>
    </nav>
  );
}
