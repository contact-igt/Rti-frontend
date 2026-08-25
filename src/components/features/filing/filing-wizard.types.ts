export type FilingWizardState = { currentStep: number };

export type FilingWizardAction =
  | { type: "NEXT"; stepCount: number }
  | { type: "BACK" }
  | { type: "GO_TO_STEP"; step: number; stepCount: number };
