export type AppealStep = { id: string; label: string };

export const appealSteps: readonly AppealStep[] = [
  { id: "review", label: "Review response" },
  { id: "grounds", label: "Appeal grounds" },
  { id: "draft", label: "Appeal draft" },
  { id: "submit", label: "Submit appeal" },
];
