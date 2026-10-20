
(() => {
  const container = document.getElementById("memory");
  if (!container) return;

  const symbols = ["🚀", "🎮", "🐱", "🍕", "⚽", "🌟", "🎧", "🔥"];

  container.innerHTML = `
    <div class="tool-panel">
      <h3>🧠 Memory</h3>
      <p id="memory-status" aria-live="polite">
        Hitta alla matchande par!
      </p>
      <p>Drag: <strong id="memory-moves">0</strong></p>
      <div id="memory-board" class="memory-board"></div>
      <button id="memory-restart">Nytt spel</button>
    </div>
  `;

  const board = container.querySelector("#memory-board");
  const status = container.querySelector("#memory-status");
  const movesDisplay = container.querySelector("#memory-moves");
  const restartButton = container.querySelector("#memory-restart");

  let deck = [];
  let firstCard = null;
  let secondCard = null;
  let locked = false;
  let moves = 0;
  let matched = 0;
  let gameId = 0;

  function shuffle(items) {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  function startGame() {
    gameId++;
    deck = shuffle([...symbols, ...symbols]);
    firstCard = null;
    secondCard = null;
    locked = false;
    moves = 0;
    matched = 0;

    movesDisplay.textContent = "0";
    status.textContent = "Hitta alla matchande par!";
    board.innerHTML = "";

    deck.forEach((symbol, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "memory-card";
      card.textContent = "?";
      card.dataset.index = String(index);
      card.setAttribute("aria-label", `Dolt kort ${index + 1}`);

      card.addEventListener("click", () => flipCard(card, symbol));

      board.appendChild(card);
    });
  }

  function flipCard(card, symbol) {
    if (
      locked ||
      card.classList.contains("matched") ||
      card === firstCard ||
      card.textContent !== "?"
    ) {
      return;
    }

    card.textContent = symbol;
    card.classList.add("flipped");
    card.setAttribute("aria-label", symbol);

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    moves++;
    movesDisplay.textContent = String(moves);

    if (firstCard.textContent === secondCard.textContent) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      firstCard.disabled = true;
      secondCard.disabled = true;

      matched += 2;
      firstCard = null;
      secondCard = null;

      if (matched === deck.length) {
        status.textContent = `🏆 Du hittade alla par på ${moves} drag!`;
      } else {
        status.textContent = "✅ Ett par hittat! Fortsätt!";
      }

      return;
    }

    locked = true;
    status.textContent = "Inte ett par. Försök igen!";

    const currentGame = gameId;
    const cardA = firstCard;
    const cardB = secondCard;

    setTimeout(() => {
      if (currentGame !== gameId) return;

      cardA.textContent = "?";
      cardB.textContent = "?";
      cardA.classList.remove("flipped");
      cardB.classList.remove("flipped");
      cardA.setAttribute("aria-label", `Dolt kort ${Number(cardA.dataset.index) + 1}`);
      cardB.setAttribute("aria-label", `Dolt kort ${Number(cardB.dataset.index) + 1}`);

      firstCard = null;
      secondCard = null;
      locked = false;
      status.textContent = "Hitta alla matchande par!";
    }, 850);
  }

  restartButton.addEventListener("click", startGame);

  startGame();
})();
