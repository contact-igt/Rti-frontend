import type { FilingState } from "@/types/filing";

const FILING_KEY = "rti-saathi:filing-progress";
const START_PROBLEM_KEY = "rti-saathi:start-problem";

type PersistedFiling = Pick<FilingState, "stage" | "problem" | "effectiveProblem" | "analysis" | "analysisMeta" | "authorityResolution" | "authority" | "draft" | "submissionKey">;

export function saveFilingProgress(state: FilingState): void {
  if (typeof window === "undefined" || state.stage === "receipt") return;
  const safeProgress: PersistedFiling = {
    stage: ["applicant", "review", "auth", "payment"].includes(state.stage) ? "applicant" : state.stage,
    problem: state.problem,
    effectiveProblem: state.effectiveProblem,
    analysis: state.analysis,
    analysisMeta: state.analysisMeta,
    authorityResolution: state.authorityResolution,
    authority: state.authority,
    draft: state.draft,
    submissionKey: state.submissionKey,
  };
  window.sessionStorage.setItem(FILING_KEY, JSON.stringify(safeProgress));
}

export function readFilingProgress(): Partial<FilingState> | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.sessionStorage.getItem(FILING_KEY);
    return value ? JSON.parse(value) as Partial<FilingState> : null;
  } catch {
    clearFilingProgress();
    return null;
  }
}

export function clearFilingProgress(): void {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(FILING_KEY);
}

export function storeStartProblem(problem: string): void {
  if (typeof window !== "undefined") window.sessionStorage.setItem(START_PROBLEM_KEY, problem);
}

export function takeStartProblem(): string {
  if (typeof window === "undefined") return "";
  const problem = window.sessionStorage.getItem(START_PROBLEM_KEY) ?? "";
  window.sessionStorage.removeItem(START_PROBLEM_KEY);
  return problem;
}
