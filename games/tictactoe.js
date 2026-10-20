
(() => {
  const container = document.getElementById("tictactoe");
  if (!container) return;

  container.innerHTML = `
    <div class="tool-panel">
      <h3>❌⭕ Tre i rad</h3>
      <p id="ttt-status" aria-live="polite">Spelare X börjar!</p>

      <div class="ttt-board" role="group" aria-label="Spelplan för tre i rad">
        ${Array.from({ length: 9 }, (_, i) =>
          `<button class="ttt-cell" data-index="${i}" aria-label="Ruta ${i + 1}"></button>`
        ).join("")}
      </div>

      <button id="ttt-reset">Starta om</button>
    </div>
  `;

  const cells = [...container.querySelectorAll(".ttt-cell")];
  const status = container.querySelector("#ttt-status");
  const resetButton = container.querySelector("#ttt-reset");

  let board = Array(9).fill("");
  let currentPlayer = "X";
  let gameOver = false;

  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function getWinner() {
    for (const [a, b, c] of winningLines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { player: board[a], line: [a, b, c] };
      }
    }
    return null;
  }

  function render() {
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
      cell.disabled = gameOver || board[index] !== "";
      cell.setAttribute(
        "aria-label",
        `Ruta ${index + 1}${board[index] ? ": " + board[index] : ""}`
      );
      cell.classList.toggle("ttt-winner", Boolean(
        getWinner()?.line.includes(index)
      ));
    });
  }

  function play(index) {
    if (gameOver || board[index]) return;

    board[index] = currentPlayer;
    const winner = getWinner();

    if (winner) {
      gameOver = true;
      status.textContent = `🎉 Spelare ${winner.player} vinner!`;
    } else if (board.every(Boolean)) {
      gameOver = true;
      status.textContent = "🤝 Oavgjort! Försök igen.";
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      status.textContent = `Spelare ${currentPlayer}s tur!`;
    }

    render();
  }

  function reset() {
    board = Array(9).fill("");
    currentPlayer = "X";
    gameOver = false;
    status.textContent = "Spelare X börjar!";
    render();
  }

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => play(index));
  });

  resetButton.addEventListener("click", reset);

  render();
})();
