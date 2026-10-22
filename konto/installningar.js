
const themeInput = document.getElementById("theme");
const newTabsInput = document.getElementById("new-tabs");
const saveButton = document.getElementById("save-settings");
const statusText = document.getElementById("status");

let currentUserId = null;

async function initSettings() {
  saveButton.disabled = true;
  statusText.textContent = "Kontrollerar ditt konto...";

  const { data, error } = await supabaseClient.auth.getUser();

  if (error || !data.user) {
    statusText.textContent =
      "Du behöver logga in för att använda och spara kontoinställningar.";
    return;
  }

  currentUserId = data.user.id;

  const { data: settings, error: settingsError } = await supabaseClient
    .from("user_settings")
    .select("theme, open_links_new_tab")
    .eq("user_id", currentUserId)
    .maybeSingle();

  if (settingsError) {
    statusText.textContent =
      "Kunde inte läsa inställningarna. Kontrollera att databastabellen är skapad.";
    console.error(settingsError);
    return;
  }

  if (settings) {
    themeInput.value = settings.theme || "dark";
    newTabsInput.checked = settings.open_links_new_tab ?? false;
  }

  applyTheme(themeInput.value);
  saveButton.disabled = false;
  statusText.textContent = "Inställningarna är redo.";
}

function applyTheme(theme) {
  const resolvedTheme = theme === "system"
    ? (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark")
    : theme;

  document.documentElement.dataset.theme = resolvedTheme;
}

themeInput.addEventListener("change", () => {
  applyTheme(themeInput.value);
});

saveButton.addEventListener("click", async () => {
  if (!currentUserId) {
    statusText.textContent = "Logga in först.";
    return;
  }

  saveButton.disabled = true;
  statusText.textContent = "Sparar...";

  const settings = {
    user_id: currentUserId,
    theme: themeInput.value,
    open_links_new_tab: newTabsInput.checked,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabaseClient
    .from("user_settings")
    .upsert(settings, { onConflict: "user_id" });

  saveButton.disabled = false;

  if (error) {
    statusText.textContent = "Kunde inte spara inställningarna.";
    console.error(error);
    return;
  }

  applyTheme(themeInput.value);
  statusText.textContent = "✅ Inställningarna har sparats!";
});

initSettings();
