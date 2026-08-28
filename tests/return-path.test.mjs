import assert from "node:assert/strict";
import { test } from "node:test";
import { safeReturnPath } from "../src/lib/auth/return-path.ts";

test("login return paths allow local routes and reject open redirects", () => {
  assert.equal(safeReturnPath("/applications"), "/applications");
  assert.equal(safeReturnPath("https://evil.example"), "/applications");
  assert.equal(safeReturnPath("//evil.example"), "/applications");
  assert.equal(safeReturnPath("/\\evil.example"), "/applications");
});
