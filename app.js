
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const filterButtons = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".tool-card");
  const noResults = document.getElementById("no-results");

  let activeFilter = "all";

  function updateCards() {
    const query = searchInput.value.trim().toLocaleLowerCase("sv");
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.category || "";
      const name = card.dataset.name || "";
      const heading = card.querySelector("h3")?.textContent || "";
      const description = card.querySelector("p")?.textContent || "";

      const searchableText =
        `${name} ${heading} ${description}`.toLocaleLowerCase("sv");

      const matchesCategory =
        activeFilter === "all" || category === activeFilter;

      const matchesSearch =
        !query || searchableText.includes(query);

      const visible = matchesCategory && matchesSearch;

      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    noResults.hidden = visibleCount !== 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const selected = item === button;

        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      updateCards();
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
  });

  searchInput.addEventListener("input", updateCards);

  updateCards();
});
