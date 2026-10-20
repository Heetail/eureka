
"use strict";

(() => {
  const container = document.getElementById("todo");
  if (!container) return;

  const STORAGE_KEY = "smartverktyg-tasks-v1";
  let tasks = [];

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved)) {
      tasks = saved.filter(
        (task) =>
          task &&
          typeof task.id === "string" &&
          typeof task.text === "string" &&
          typeof task.done === "boolean"
      );
    }
  } catch {
    tasks = [];
  }

  container.innerHTML = `
    <form id="todo-form">
      <input
        id="todo-input"
        type="text"
        maxlength="200"
        placeholder="Skriv en uppgift..."
        aria-label="Ny uppgift"
        required
      >
      <button type="submit">+ Lägg till uppgift</button>
    </form>
    <p class="result" id="todo-count" aria-live="polite"></p>
    <ul id="todo-list"></ul>
    <button type="button" id="todo-clear" class="secondary-button">
      Ta bort alla klara
    </button>
  `;

  const form = container.querySelector("#todo-form");
  const input = container.querySelector("#todo-input");
  const list = container.querySelector("#todo-list");
  const count = container.querySelector("#todo-count");
  const clearButton = container.querySelector("#todo-clear");

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      count.textContent = "Kunde inte spara i webbläsaren.";
    }
  }

  function render() {
    list.replaceChildren();

    const remaining = tasks.filter((task) => !task.done).length;
    count.textContent =
      tasks.length === 0
        ? "Inga uppgifter ännu."
        : `${remaining} uppgifter kvar av ${tasks.length}.`;

    tasks.forEach((task) => {
      const item = document.createElement("li");
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      const text = document.createElement("span");
      const remove = document.createElement("button");

      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.setAttribute(
        "aria-label",
        `Markera ${task.text} som ${task.done ? "inte klar" : "klar"}`
      );

      text.textContent = task.text;

      if (task.done) {
        text.style.textDecoration = "line-through";
        text.style.opacity = "0.6";
      }

      label.style.display = "flex";
      label.style.alignItems = "center";
      label.style.gap = "8px";
      label.style.flex = "1";
      label.style.minWidth = "0";
      label.style.overflowWrap = "anywhere";

      checkbox.style.width = "auto";
      checkbox.style.margin = "0";

      label.append(checkbox, text);

      remove.type = "button";
      remove.textContent = "Ta bort";
      remove.className = "secondary-button";
      remove.setAttribute("aria-label", `Ta bort ${task.text}`);

      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        save();
        render();
      });

      remove.addEventListener("click", () => {
        tasks = tasks.filter((entry) => entry.id !== task.id);
        save();
        render();
      });

      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.gap = "8px";
      item.append(label, remove);
      list.append(item);
    });

    clearButton.hidden = !tasks.some((task) => task.done);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    tasks.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      done: false
    });

    save();
    render();
    input.value = "";
    input.focus();
  });

  clearButton.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.done);
    save();
    render();
  });

  render();
})();
