import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DISPLAY_NAME_MAX,
  DISPLAY_NAME_MIN,
  validateDisplayName,
  validateEmail,
  validateSettingsForm,
} from "../js/validation.js";

describe("validateDisplayName", () => {
  it("rejects whitespace-only names", () => {
    assert.equal(validateDisplayName("   "), "Display name is required.");
    assert.equal(validateDisplayName("\t\n"), "Display name is required.");
  });

  it("rejects names shorter than the minimum length", () => {
    assert.equal(
      validateDisplayName("a"),
      `Display name must be at least ${DISPLAY_NAME_MIN} characters.`
    );
  });

  it("accepts names at the minimum length", () => {
    assert.equal(validateDisplayName("ab"), null);
    assert.equal(validateDisplayName("  ab  "), null);
  });

  it("rejects names longer than the maximum length", () => {
    const tooLong = "a".repeat(DISPLAY_NAME_MAX + 1);
    assert.equal(
      validateDisplayName(tooLong),
      `Display name must be ${DISPLAY_NAME_MAX} characters or fewer.`
    );
  });

  it("accepts names at the maximum length", () => {
    const maxName = "a".repeat(DISPLAY_NAME_MAX);
    assert.equal(validateDisplayName(maxName), null);
  });
});

describe("validateEmail", () => {
  it("rejects empty email", () => {
    assert.equal(validateEmail(""), "Email is required.");
    assert.equal(validateEmail("   "), "Email is required.");
  });

  it("rejects email without @", () => {
    assert.equal(validateEmail("notanemail"), "Enter a valid email address.");
    assert.equal(validateEmail("user.example.com"), "Enter a valid email address.");
  });

  it("rejects email without a domain dot", () => {
    assert.equal(validateEmail("user@domain"), "Enter a valid email address.");
  });

  it("accepts a valid email format", () => {
    assert.equal(validateEmail("user@example.com"), null);
    assert.equal(validateEmail("  user@example.com  "), null);
  });
});

describe("validateSettingsForm", () => {
  it("returns only errors for invalid fields", () => {
    const errors = validateSettingsForm({
      displayName: "Valid Name",
      email: "bad-email",
    });

    assert.deepEqual(errors, {
      email: "Enter a valid email address.",
    });
  });

  it("returns multiple errors when both fields are invalid", () => {
    const errors = validateSettingsForm({
      displayName: " ",
      email: "missing-at-sign",
    });

    assert.deepEqual(errors, {
      displayName: "Display name is required.",
      email: "Enter a valid email address.",
    });
  });

  it("returns no errors when all fields are valid", () => {
    const errors = validateSettingsForm({
      displayName: "FlyRank User",
      email: "user@flyrank.com",
    });

    assert.deepEqual(errors, {});
  });
});
