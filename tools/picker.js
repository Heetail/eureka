
(() => {
  const container = document.getElementById("picker");
  if (!container) return;

  container.innerHTML = `
    <div class="tool-panel">
      <h3>🎲 Slumpväljare</h3>
      <p>Skriv ett alternativ per rad och låt slumpen välja!</p>

      <label for="picker-options">Dina alternativ</label>
      <textarea
        id="picker-options"
        rows="6"
        placeholder="Pizza&#10;Hamburgare&#10;Tacos"
      >Pizza
Hamburgare
Tacos</textarea>

      <button id="picker-button">Välj slumpmässigt</button>
      <button id="picker-clear">Rensa listan</button>

      <div id="picker-result" aria-live="polite">
        <p>Ditt resultat visas här!</p>
      </div>
    </div>
  `;

  const optionsInput = container.querySelector("#picker-options");
  const result = container.querySelector("#picker-result");

  container.querySelector("#picker-button").addEventListener("click", () => {
    const options = optionsInput.value
      .split("\n")
      .map((option) => option.trim())
      .filter((option) => option.length > 0);

    if (options.length === 0) {
      result.textContent = "Skriv minst ett alternativ först!";
      return;
    }

    const index = Math.floor(Math.random() * options.length);
    result.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "🎉 Valet är:";
    const chosen = document.createElement("p");
    chosen.textContent = options[index];

    result.append(heading, chosen);
  });

  container.querySelector("#picker-clear").addEventListener("click", () => {
    optionsInput.value = "";
    result.textContent = "Listan är rensad. Lägg till nya alternativ!";
    optionsInput.focus();
  });
})();
