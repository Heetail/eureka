"use strict";

(() => {
  const container = document.getElementById("calculator");
  if (!container) return;

  container.innerHTML = `
    <input
      id="calc-display"
      type="text"
      inputmode="decimal"
      placeholder="Exempel: (25 + 5) * 2"
      aria-label="Matematiskt uttryck"
      autocomplete="off"
    >
    <div class="calc-buttons">
      <button type="button" data-calc="7">7</button>
      <button type="button" data-calc="8">8</button>
      <button type="button" data-calc="9">9</button>
      <button type="button" data-calc="/">÷</button>
      <button type="button" data-calc="4">4</button>
      <button type="button" data-calc="5">5</button>
      <button type="button" data-calc="6">6</button>
      <button type="button" data-calc="*">×</button>
      <button type="button" data-calc="1">1</button>
      <button type="button" data-calc="2">2</button>
      <button type="button" data-calc="3">3</button>
      <button type="button" data-calc="-">−</button>
      <button type="button" data-calc="0">0</button>
      <button type="button" data-calc=".">.</button>
      <button type="button" data-calc="(">(</button>
      <button type="button" data-calc=")">)</button>
      <button type="button" data-action="clear" class="secondary-button">Rensa</button>
      <button type="button" data-action="backspace" class="secondary-button">⌫</button>
      <button type="button" data-calc="+">+</button>
      <button type="button" data-action="equals">=</button>
    </div>
    <div class="result" id="calc-result" aria-live="polite"></div>
  `;

  const display = container.querySelector("#calc-display");
  const result = container.querySelector("#calc-result");
  const buttons = container.querySelector(".calc-buttons");

  function calculate() {
    const expression = display.value.trim();

    if (!expression) {
      result.textContent = "Skriv ett tal först.";
      return;
    }

    // Tillåt endast matematiska tecken och siffror.
    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      result.textContent = "Använd endast tal och räknetecken.";
      return;
    }

    try {
      // Uttrycket kontrolleras innan det beräknas.
      const answer = Function(
        '"use strict"; return (' + expression + ');'
      )();

      if (typeof answer !== "number" || !Number.isFinite(answer)) {
        result.textContent = "Det går inte att räkna ut.";
        return;
      }

      result.textContent = "= " + Number(answer.toPrecision(12));
    } catch {
      result.textContent = "Kontrollera uttrycket.";
    }
  }

  buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const value = button.dataset.calc;
    const action = button.dataset.action;

    if (value !== undefined) {
      display.value += value;
      display.focus();
      return;
    }

    if (action === "clear") {
      display.value = "";
      result.textContent = "";
    } else if (action === "backspace") {
      display.value = display.value.slice(0, -1);
      display.focus();
    } else if (action === "equals") {
      calculate();
    }
  });

  display.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      calculate();
    }

    if (event.key === "Escape") {
      display.value = "";
      result.textContent = "";
    }
  });
})();
