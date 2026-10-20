
"use strict";

(() => {
  const container = document.getElementById("password");
  if (!container) return;

  container.innerHTML = `
    <label for="password-length">Lösenordets längd</label>
    <input
      id="password-length"
      type="number"
      min="8"
      max="64"
      value="16"
    >

    <label>
      <input id="password-upper" type="checkbox" checked>
      Stora bokstäver (A-Z)
    </label>

    <label>
      <input id="password-lower" type="checkbox" checked>
      Små bokstäver (a-z)
    </label>

    <label>
      <input id="password-numbers" type="checkbox" checked>
      Siffror (0-9)
    </label>

    <label>
      <input id="password-symbols" type="checkbox" checked>
      Specialtecken (!@#$...)
    </label>

    <button type="button" id="password-generate">
      🔐 Skapa lösenord
    </button>

    <div
      id="password-output"
      class="result"
      role="status"
      aria-live="polite"
      style="overflow-wrap:anywhere;user-select:all"
    >Ditt lösenord visas här.</div>

    <button
      type="button"
      id="password-copy"
      class="secondary-button"
    >📋 Kopiera lösenord</button>

    <p id="password-status" aria-live="polite"></p>
  `;

  const lengthInput = container.querySelector("#password-length");
  const upperInput = container.querySelector("#password-upper");
  const lowerInput = container.querySelector("#password-lower");
  const numbersInput = container.querySelector("#password-numbers");
  const symbolsInput = container.querySelector("#password-symbols");
  const generateButton = container.querySelector("#password-generate");
  const copyButton = container.querySelector("#password-copy");
  const output = container.querySelector("#password-output");
  const status = container.querySelector("#password-status");

  let currentPassword = "";

  const groups = [
    { input: upperInput, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
    { input: lowerInput, chars: "abcdefghijklmnopqrstuvwxyz" },
    { input: numbersInput, chars: "0123456789" },
    { input: symbolsInput, chars: "!@#$%^&*()-_=+[]{}?" }
  ];

  function secureIndex(max) {
    if (!Number.isSafeInteger(max) || max < 1) {
      throw new Error("Ogiltigt slumptalsintervall.");
    }

    const cryptoObject = window.crypto;

    if (!cryptoObject || !cryptoObject.getRandomValues) {
      throw new Error("Säker slumptalsgenerator saknas.");
    }

    // Avvisningssampling undviker modulo-bias.
    const range = 0x100000000;
    const limit = Math.floor(range / max) * max;
    const buffer = new Uint32Array(1);

    do {
      cryptoObject.getRandomValues(buffer);
    } while (buffer[0] >= limit);

    return buffer[0] % max;
  }

  function secureShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = secureIndex(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  function generatePassword() {
    status.textContent = "";
    currentPassword = "";

    const length = Number(lengthInput.value);
    const selectedGroups = groups.filter((group) => group.input.checked);

    if (
      !Number.isInteger(length) ||
      length < 8 ||
      length > 64
    ) {
      status.textContent = "Välj en längd mellan 8 och 64 tecken.";
      output.textContent = "Inget lösenord skapat.";
      return;
    }

    if (selectedGroups.length === 0) {
      status.textContent = "Välj minst en teckentyp.";
      output.textContent = "Inget lösenord skapat.";
      return;
    }

    if (length < selectedGroups.length) {
      status.textContent =
        "Lösenordet är för kort för alla valda teckentyper.";
      return;
    }

    try {
      const allChars = selectedGroups
        .map((group) => group.chars)
        .join("");

      const passwordChars = [];

      // Se till att varje vald grupp representeras minst en gång.
      for (const group of selectedGroups) {
        passwordChars.push(
          group.chars[secureIndex(group.chars.length)]
        );
      }

      // Fyll resten av lösenordet med valda tecken.
      while (passwordChars.length < length) {
        passwordChars.push(
          allChars[secureIndex(allChars.length)]
        );
      }

      secureShuffle(passwordChars);

      currentPassword = passwordChars.join("");
      output.textContent = currentPassword;
      status.textContent = "Lösenord skapat!";
    } catch {
      status.textContent =
        "Kunde inte skapa ett säkert lösenord i den här webbläsaren.";
      output.textContent = "Försök med en annan webbläsare.";
    }
  }

  async function copyPassword() {
    if (!currentPassword) {
      status.textContent = "Skapa ett lösenord först.";
      return;
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Urklipp stöds inte.");
      }

      await navigator.clipboard.writeText(currentPassword);
      status.textContent = "✓ Lösenordet har kopierats!";
    } catch {
      status.textContent =
        "Kunde inte kopiera automatiskt. Markera lösenordet och kopiera manuellt.";
    }
  }

  generateButton.addEventListener("click", generatePassword);
  copyButton.addEventListener("click", copyPassword);

  generatePassword();
})();
