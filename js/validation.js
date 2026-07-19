/**
 * Client-side validation for the settings form.
 * Kept in a separate module so the same rules can be unit tested.
 */

export const DISPLAY_NAME_MIN = 2;
export const DISPLAY_NAME_MAX = 50;

// Basic email check: non-empty local part, @, and domain with a dot
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @param {string} value
 * @returns {string|null} Error message or null when valid
 */
export function validateDisplayName(value) {
  const trimmed = (value ?? "").trim();

  if (trimmed.length === 0) {
    return "Display name is required.";
  }

  if (trimmed.length < DISPLAY_NAME_MIN) {
    return `Display name must be at least ${DISPLAY_NAME_MIN} characters.`;
  }

  if (trimmed.length > DISPLAY_NAME_MAX) {
    return `Display name must be ${DISPLAY_NAME_MAX} characters or fewer.`;
  }

  return null;
}

/**
 * @param {string} value
 * @returns {string|null} Error message or null when valid
 */
export function validateEmail(value) {
  const trimmed = (value ?? "").trim();

  if (trimmed.length === 0) {
    return "Email is required.";
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address.";
  }

  return null;
}

/**
 * Validates all settings fields and returns field-level errors.
 * Only invalid fields appear in the returned object.
 *
 * @param {{ displayName: string, email: string }} fields
 * @returns {Record<string, string>}
 */
export function validateSettingsForm(fields) {
  const errors = {};

  const nameError = validateDisplayName(fields.displayName);
  if (nameError) {
    errors.displayName = nameError;
  }

  const emailError = validateEmail(fields.email);
  if (emailError) {
    errors.email = emailError;
  }

  return errors;
}
