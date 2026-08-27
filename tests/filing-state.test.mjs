import assert from "node:assert/strict";
import { test } from "node:test";
import { filingReducer, initialFilingState } from "../src/components/features/filing/filing-state.ts";

const populated = {
  ...initialFilingState,
  problem: "Original problem",
  effectiveProblem: "Original problem",
  analysis: { issueType: "Pension", informationNeeded: ["Status"], jurisdiction: "central", clarificationNeeded: false, clarificationQuestion: null },
  clarificationHistory: [{ identity: "old", question: "Question", jurisdiction: "central", answer: { text: "Answer" }, submitted: true }],
  authority: { authorityId: "one", authorityName: "Authority one", jurisdiction: "central" },
  draft: { subject: "Subject", context: null, questions: ["One", "Two", "Three"], authorityId: "one", warnings: [] },
  review: { marker: "review" },
  paymentProof: { marker: "payment" },
};

test("upstream filing changes invalidate only their downstream state", () => {
  const problem = filingReducer(populated, { type: "SET_PROBLEM", problem: "Changed problem" });
  assert.equal(problem.analysis, null);
  assert.equal(problem.authority, null);
  assert.equal(problem.draft, null);
  assert.equal(problem.review, null);
  assert.equal(problem.paymentProof, null);
  assert.deepEqual(problem.clarificationHistory, []);

  const authority = filingReducer(populated, { type: "SET_AUTHORITY", authority: { authorityId: "two", authorityName: "Authority two", jurisdiction: "central" } });
  assert.equal(authority.draft, null);
  assert.equal(authority.review, null);
  assert.equal(authority.paymentProof, null);

  const draft = filingReducer(populated, { type: "EDIT_DRAFT", draft: { ...populated.draft, subject: "Edited" } });
  assert.equal(draft.review, null);
  assert.equal(draft.paymentProof, null);

  assert.equal(filingReducer(populated, { type: "SET_APPLICANT", applicant: populated.applicant }).review, null);
  assert.equal(filingReducer(populated, { type: "SET_DOCUMENTS", documents: [] }).paymentProof, null);
});
