
(() => {
  const container = document.getElementById("reaction");
  if (!container) return;

  container.innerHTML = `
    <div class="tool-panel">
      <h3>⚡ Reaktionstest</h3>
      <p id="reaction-status" aria-live="polite">
        Tryck på knappen när du är redo!
      </p>

      <div
        id="reaction-arena"
        style="padding: 35px 15px; text-align: center; border-radius: 12px; background: #64748b; color: white;"
      >
        <strong id="reaction-message">Redo?</strong>
      </div>

      <button id="reaction-start">Starta testet</button>
      <p>Din senaste tid: <strong id="reaction-result">Ingen ännu</strong></p>
      <p>Bästa tid denna session: <strong id="reaction-best">Ingen ännu</strong></p>
    </div>
  `;

  const status = container.querySelector("#reaction-status");
  const arena = container.querySelector("#reaction-arena");
  const message = container.querySelector("#reaction-message");
  const startButton = container.querySelector("#reaction-start");
  const result = container.querySelector("#reaction-result");
  const bestDisplay = container.querySelector("#reaction-best");

  let state = "idle";
  let timeoutId = null;
  let startTime = 0;
  let bestTime = Infinity;

  function resetArena() {
    arena.style.background = "#64748b";
    message.textContent = "Vänta på grönt!";
  }

  function startTest() {
    clearTimeout(timeoutId);
    state = "waiting";
    startButton.disabled = true;
    result.textContent = "Väntar...";
    status.textContent = "Vänta tills rutan blir grön. Klicka inte för tidigt!";
    arena.style.background = "#dc2626";
    message.textContent = "Vänta...";

    const delay = 1500 + Math.random() * 3500;

    timeoutId = setTimeout(() => {
      state = "go";
      startTime = performance.now();
      arena.style.background = "#16a34a";
      message.textContent = "KLICKA NU!";
      status.textContent = "Nu! Klicka så snabbt du kan!";
    }, delay);
  }

  function handleClick() {
    if (state === "waiting") {
      clearTimeout(timeoutId);
      state = "early";
      arena.style.background = "#d97706";
      message.textContent = "För tidigt!";
      status.textContent = "Du klickade för tidigt. Försök igen!";
      startButton.disabled = false;
      return;
    }

    if (state === "go") {
      const reactionTime = Math.round(performance.now() - startTime);
      state = "finished";

      result.textContent = `${reactionTime} ms`;

      if (reactionTime < bestTime) {
        bestTime = reactionTime;
        bestDisplay.textContent = `${bestTime} ms`;
      }

      arena.style.background = "#2563eb";
      message.textContent = `${reactionTime} ms`;
      status.textContent =
        reactionTime < 200
          ? "Blixtsnabbt! ⚡"
          : reactionTime < 300
            ? "Bra reaktion!"
            : "Försök igen och slå ditt rekord!";

      startButton.disabled = false;
      return;
    }

    if (state === "idle" || state === "finished" || state === "early") {
      status.textContent = "Tryck på Starta testet för en ny omgång.";
    }
  }

  arena.addEventListener("click", handleClick);

  startButton.addEventListener("click", () => {
    if (state === "waiting" || state === "go") return;
    startTest();
  });
})();
