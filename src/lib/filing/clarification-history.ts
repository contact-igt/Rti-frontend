import type { ClarificationAttempt, ClarificationState, RTIAnalysis } from "../../types/filing";

type ClarificationPrompt = Pick<NonNullable<ClarificationState>, "question" | "jurisdiction">;

export function clarificationIdentity(prompt: ClarificationPrompt, analysis: RTIAnalysis): string {
  const informationNeeded = analysis.informationNeeded.map(normalize).sort().join("|");
  return [
    normalize(prompt.question),
    prompt.jurisdiction,
    normalize(analysis.issueType),
    analysis.jurisdiction,
    informationNeeded,
  ].join("::");
}

export function hasSubmittedClarification(
  history: ClarificationAttempt[],
  prompt: ClarificationPrompt,
  analysis: RTIAnalysis,
): boolean {
  const identity = clarificationIdentity(prompt, analysis);
  return history.some((attempt) => attempt.submitted && attempt.identity === identity);
}

export function previousClarificationAnswer(history: ClarificationAttempt[], prompt: ClarificationPrompt) {
  const question = normalize(prompt.question);
  return [...history].reverse().find(
    (attempt) => normalize(attempt.question) === question && attempt.jurisdiction === prompt.jurisdiction,
  )?.answer;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
