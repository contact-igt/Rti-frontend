import type { FilingWizardAction, FilingWizardState } from "@/components/features/filing/filing-wizard.types";

export function filingWizardReducer(state: FilingWizardState, action: FilingWizardAction): FilingWizardState {
  switch (action.type) {
    case "NEXT": return { currentStep: Math.min(state.currentStep + 1, action.stepCount - 1) };
    case "BACK": return { currentStep: Math.max(state.currentStep - 1, 0) };
    case "GO_TO_STEP": return { currentStep: Math.min(Math.max(action.step, 0), action.stepCount - 1) };
  }
}
