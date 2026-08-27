import assert from "node:assert/strict";
import { test } from "node:test";
import {
  clarificationIdentity,
  hasSubmittedClarification,
  previousClarificationAnswer,
} from "../src/lib/filing/clarification-history.ts";

const prompt = {
  question: "Which government service, department, scheme or office is this request related to?",
  jurisdiction: "central",
};
const analysis = {
  issueType: "Unknown Central service records",
  informationNeeded: ["Current status", "File movement"],
  jurisdiction: "central",
  clarificationNeeded: false,
  clarificationQuestion: null,
};
const attempt = {
  identity: clarificationIdentity(prompt, analysis),
  question: prompt.question,
  jurisdiction: prompt.jurisdiction,
  answer: { text: "A Central service not yet mapped" },
  submitted: true,
};

test("same authority clarification and unchanged analysis is treated as already submitted", () => {
  assert.equal(
    hasSubmittedClarification(
      [attempt],
      { ...prompt, question: `  ${prompt.question.toUpperCase()}  ` },
      { ...analysis, informationNeeded: [...analysis.informationNeeded].reverse() },
    ),
    true,
  );
  assert.deepEqual(previousClarificationAnswer([attempt], prompt), attempt.answer);
});

test("a different question or meaningfully changed analysis is allowed", () => {
  assert.equal(
    hasSubmittedClarification([attempt], { ...prompt, question: "Which ministry handles this service?" }, analysis),
    false,
  );
  assert.equal(
    hasSubmittedClarification([attempt], prompt, { ...analysis, issueType: "A newly identified Central scheme" }),
    false,
  );
});
