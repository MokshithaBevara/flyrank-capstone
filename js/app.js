const STORAGE_KEY = "flyrank-settings";

const form = document.getElementById("settings-form");
const messageEl = document.getElementById("form-message");
const resetBtn = document.getElementById("reset-btn");

const defaultSettings = {
  displayName: "",
  email: "",
  apiKey: "",
  theme: "system",
  language: "en",
  emailAlerts: false,
  weeklyDigest: false,
};

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : { ...defaultSettings };
  } catch {
    return { ...defaultSettings };
  }
}

function saveSettings(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function applyTheme(theme) {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

function populateForm(settings) {
  form.displayName.value = settings.displayName;
  form.email.value = settings.email;
  form.apiKey.value = settings.apiKey;
  form.theme.value = settings.theme;
  form.language.value = settings.language;
  form.emailAlerts.checked = settings.emailAlerts;
  form.weeklyDigest.checked = settings.weeklyDigest;
  applyTheme(settings.theme);
}

function getFormData() {
  return {
    displayName: form.displayName.value.trim(),
    email: form.email.value.trim(),
    apiKey: form.apiKey.value.trim(),
    theme: form.theme.value,
    language: form.language.value,
    emailAlerts: form.emailAlerts.checked,
    weeklyDigest: form.weeklyDigest.checked,
  };
}

function showMessage(text) {
  messageEl.textContent = text;
  messageEl.hidden = false;
  messageEl.className = "form-message form-message--success";
}

function hideMessage() {
  messageEl.hidden = true;
}

// Load saved settings on page load
populateForm(loadSettings());

form.addEventListener("submit", (event) => {
  event.preventDefault();
  hideMessage();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = getFormData();
  saveSettings(data);
  applyTheme(data.theme);
  showMessage("Settings saved successfully.");
});

form.theme.addEventListener("change", () => {
  applyTheme(form.theme.value);
});

resetBtn.addEventListener("click", () => {
  hideMessage();
  populateForm(defaultSettings);
  localStorage.removeItem(STORAGE_KEY);
  showMessage("Settings reset to defaults.");
});
