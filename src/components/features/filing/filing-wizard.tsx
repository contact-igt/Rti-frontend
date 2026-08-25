"use client";

import { useReducer } from "react";
import { filingSteps } from "@/config/filing-steps";
import { filingWizardReducer } from "@/components/features/filing/filing-wizard.reducer";

export function FilingWizard() {
  const [state, dispatch] = useReducer(filingWizardReducer, { currentStep: 0 });
  const currentStep = filingSteps[state.currentStep];
  const isFirstStep = state.currentStep === 0;
  const isLastStep = state.currentStep === filingSteps.length - 1;

  const next = () => dispatch({ type: "NEXT", stepCount: filingSteps.length });
  const back = () => dispatch({ type: "BACK" });
  const goToStep = (step: number) => dispatch({ type: "GO_TO_STEP", step, stepCount: filingSteps.length });

  return (
    <section aria-label="RTI filing steps" className="wizard">
      <ol className="wizard__steps">
        {filingSteps.map((step, index) => (
          <li key={step.id}>
            <button aria-current={index === state.currentStep ? "step" : undefined} onClick={() => goToStep(index)} type="button">
              {index + 1}. {step.label}
            </button>
          </li>
        ))}
      </ol>
      <div className="wizard__content">
        <p className="eyebrow">Step {state.currentStep + 1} of {filingSteps.length}</p>
        <h2>{currentStep.label}</h2>
        <p>{currentStep.description}</p>
        <div className="wizard__actions">
          <button disabled={isFirstStep} onClick={back} type="button">Back</button>
          <button disabled={isLastStep} onClick={next} type="button">Next</button>
        </div>
      </div>
    </section>
  );
}
