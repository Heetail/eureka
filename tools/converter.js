
(() => {
  const container = document.getElementById("converter");
  if (!container) return;

  const units = {
    km: { label: "Kilometer (km)", factor: 1000 },
    m: { label: "Meter (m)", factor: 1 },
    cm: { label: "Centimeter (cm)", factor: 0.01 },
    mm: { label: "Millimeter (mm)", factor: 0.001 },
    mile: { label: "Miles (mi)", factor: 1609.344 },
    ft: { label: "Feet (ft)", factor: 0.3048 },
    inch: { label: "Tum (in)", factor: 0.0254 }
  };

  const options = Object.entries(units)
    .map(([key, unit]) =>
      `<option value="${key}">${unit.label}</option>`
    )
    .join("");

  container.innerHTML = `
    <div class="tool-panel">
      <h3>Måttomvandlare</h3>
      <label for="convert-value">Värde</label>
      <input id="convert-value" type="number" value="1" step="any">

      <label for="convert-from">Från</label>
      <select id="convert-from">${options}</select>

      <label for="convert-to">Till</label>
      <select id="convert-to">${options}</select>

      <button id="convert-button">Omvandla</button>
      <p id="convert-result" aria-live="polite">Resultatet visas här.</p>
    </div>
  `;

  const valueInput = container.querySelector("#convert-value");
  const fromSelect = container.querySelector("#convert-from");
  const toSelect = container.querySelector("#convert-to");
  const result = container.querySelector("#convert-result");

  fromSelect.value = "km";
  toSelect.value = "m";

  function convert() {
    const value = Number(valueInput.value);

    if (valueInput.value.trim() === "" || !Number.isFinite(value)) {
      result.textContent = "Skriv in ett giltigt tal.";
      return;
    }

    const meters = value * units[fromSelect.value].factor;
    const converted = meters / units[toSelect.value].factor;

    result.textContent =
      `${value} ${fromSelect.value} = ${Number(converted.toPrecision(10))} ${toSelect.value}`;
  }

  container.querySelector("#convert-button").addEventListener("click", convert);
  valueInput.addEventListener("input", convert);
  fromSelect.addEventListener("change", convert);
  toSelect.addEventListener("change", convert);

  convert();
})();
