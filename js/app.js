import { validateSettingsForm } from "./validation.js";

const STORAGE_KEY = "flyrank-settings";

const form = document.getElementById("settings-form");
const displayNameInput = document.getElementById("display-name");
const emailInput = document.getElementById("email");
const themeSelect = document.getElementById("theme");
const notificationsCheckbox = document.getElementById("notifications");
const formSummary = document.getElementById("form-summary");
const saveButton = document.getElementById("save-settings");
const resetButton = document.getElementById("reset-settings");

const fieldConfig = [
  { name: "displayName", input: displayNameInput, errorId: "display-name-error" },
  { name: "email", input: emailInput, errorId: "email-error" },
];

const defaultValues = {
  displayName: "",
  email: "",
  theme: "system",
  notifications: false,
};

function getFormValues() {
  return {
    displayName: displayNameInput.value,
    email: emailInput.value,
    theme: themeSelect.value,
    notifications: notificationsCheckbox.checked,
  };
}

function setFormValues(values) {
  displayNameInput.value = values.displayName;
  emailInput.value = values.email;
  themeSelect.value = values.theme;
  notificationsCheckbox.checked = values.notifications;
}

function clearFieldError(field) {
  const errorEl = document.getElementById(field.errorId);
  field.input.setAttribute("aria-invalid", "false");
  field.input.classList.remove("input-error");
  errorEl.textContent = "";
  errorEl.hidden = true;
}

function showFieldError(field, message) {
  const errorEl = document.getElementById(field.errorId);
  field.input.setAttribute("aria-invalid", "true");
  field.input.classList.add("input-error");
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function applyFieldErrors(errors) {
  for (const field of fieldConfig) {
    if (errors[field.name]) {
      showFieldError(field, errors[field.name]);
    } else {
      clearFieldError(field);
    }
  }
}

function showFormSummary(message, type = "error") {
  formSummary.textContent = message;
  formSummary.classList.remove("form-summary--error", "form-summary--success");
  formSummary.classList.add(type === "success" ? "form-summary--success" : "form-summary--error");
  formSummary.hidden = false;
}

function hideFormSummary() {
  formSummary.textContent = "";
  formSummary.classList.remove("form-summary--error", "form-summary--success");
  formSummary.hidden = true;
}

function loadSettings() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    setFormValues(defaultValues);
    return;
  }

  try {
    const parsed = JSON.parse(stored);
    setFormValues({ ...defaultValues, ...parsed });
  } catch {
    setFormValues(defaultValues);
  }
}

function saveSettings(values) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const values = getFormValues();
  const errors = validateSettingsForm(values);

  applyFieldErrors(errors);

  if (Object.keys(errors).length > 0) {
    showFormSummary("Please fix the errors below before saving.");
    const firstInvalid = fieldConfig.find((field) => errors[field.name]);
    firstInvalid?.input.focus();
    return;
  }

  hideFormSummary();
  saveSettings(values);
  showFormSummary("Settings saved successfully.", "success");
});

resetButton.addEventListener("click", () => {
  setFormValues(defaultValues);
  applyFieldErrors({});
  hideFormSummary();
  displayNameInput.focus();
});

loadSettings();
