
"use strict";

(() => {
  const container = document.getElementById("notes");
  if (!container) return;

  const STORAGE_KEY = "smartverktyg-notes-v1";

  container.innerHTML = `
    <textarea
      id="notes-text"
      maxlength="50000"
      placeholder="Skriv dina anteckningar här..."
      aria-label="Mina anteckningar"
      rows="7"
    ></textarea>

    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button type="button" id="notes-save">Spara anteckningar</button>
      <button type="button" id="notes-clear" class="secondary-button">
        Rensa
      </button>
    </div>

    <p id="notes-status" class="result" aria-live="polite">
      Dina anteckningar laddas...
    </p>
  `;

  const textarea = container.querySelector("#notes-text");
  const saveButton = container.querySelector("#notes-save");
  const clearButton = container.querySelector("#notes-clear");
  const status = container.querySelector("#notes-status");

  function saveNotes() {
    try {
      localStorage.setItem(STORAGE_KEY, textarea.value);
      status.textContent = "✓ Anteckningarna är sparade!";
    } catch {
      status.textContent =
        "Det gick inte att spara. Kontrollera webbläsarens lagring.";
    }
  }

  try {
    textarea.value = localStorage.getItem(STORAGE_KEY) || "";
    status.textContent = "Dina anteckningar är redo.";
  } catch {
    status.textContent = "Kunde inte läsa sparade anteckningar.";
  }

  // Spara automatiskt när du skriver.
  let saveMessageTimer;

  textarea.addEventListener("input", () => {
    try {
      localStorage.setItem(STORAGE_KEY, textarea.value);
      status.textContent = "✓ Sparat automatiskt";
    } catch {
      status.textContent = "Automatisk lagring misslyckades.";
    }

    clearTimeout(saveMessageTimer);
    saveMessageTimer = setTimeout(() => {
      status.textContent = "Ändringarna sparas automatiskt.";
    }, 2000);
  });

  saveButton.addEventListener("click", saveNotes);

  clearButton.addEventListener("click", () => {
    if (!textarea.value) {
      status.textContent = "Anteckningarna är redan tomma.";
      return;
    }

    const confirmed = confirm(
      "Vill du verkligen rensa alla dina anteckningar?"
    );

    if (!confirmed) return;

    textarea.value = "";

    try {
      localStorage.removeItem(STORAGE_KEY);
      status.textContent = "Anteckningarna har rensats.";
    } catch {
      status.textContent = "Kunde inte rensa den sparade texten.";
    }
  });
})();
