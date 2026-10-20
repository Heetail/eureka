
(() => {
  const container = document.getElementById("percent");
  if (!container) return;

  container.innerHTML = `
    <div class="tool-panel">
      <h3>Procenträknare</h3>

      <label for="percent-value">Vilket är talet?</label>
      <input id="percent-value" type="number" value="200" step="any">

      <label for="percent-rate">Procent (%)</label>
      <input id="percent-rate" type="number" value="15" step="any">

      <button id="percent-calculate">Räkna ut procent</button>
      <p id="percent-result" aria-live="polite">Resultatet visas här.</p>

      <hr>

      <h3>Rabattkalkylator</h3>

      <label for="discount-price">Ordinarie pris (kr)</label>
      <input id="discount-price" type="number" value="500" min="0" step="any">

      <label for="discount-rate">Rabatt (%)</label>
      <input id="discount-rate" type="number" value="20" min="0" max="100" step="any">

      <button id="discount-calculate">Beräkna rabatt</button>
      <p id="discount-result" aria-live="polite">Rabattpriset visas här.</p>
    </div>
  `;

  const get = (id) => container.querySelector(`#${id}`);

  function calculatePercent() {
    const valueText = get("percent-value").value;
    const rateText = get("percent-rate").value;
    const value = Number(valueText);
    const rate = Number(rateText);

    if (
      valueText.trim() === "" ||
      rateText.trim() === "" ||
      !Number.isFinite(value) ||
      !Number.isFinite(rate)
    ) {
      get("percent-result").textContent = "Skriv in giltiga tal.";
      return;
    }

    const answer = value * rate / 100;

    get("percent-result").textContent =
      `${rate}% av ${value} är ${Number(answer.toPrecision(10))}.`;
  }

  function calculateDiscount() {
    const priceText = get("discount-price").value;
    const rateText = get("discount-rate").value;
    const price = Number(priceText);
    const rate = Number(rateText);

    if (
      priceText.trim() === "" ||
      rateText.trim() === "" ||
      !Number.isFinite(price) ||
      !Number.isFinite(rate) ||
      price < 0 ||
      rate < 0 ||
      rate > 100
    ) {
      get("discount-result").textContent =
        "Ange ett pris över 0 och en rabatt mellan 0 och 100%.";
      return;
    }

    const savings = price * rate / 100;
    const finalPrice = price - savings;

    get("discount-result").textContent =
      `Du sparar ${savings.toFixed(2)} kr. Slutpris: ${finalPrice.toFixed(2)} kr.`;
  }

  get("percent-calculate").addEventListener("click", calculatePercent);
  get("discount-calculate").addEventListener("click", calculateDiscount);

  calculatePercent();
  calculateDiscount();
})();
