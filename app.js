
(() => {
  const search = document.getElementById("search");
  const cards = [...document.querySelectorAll(".tool-card")];
  const filters = [...document.querySelectorAll(".filter")];
  const emptyMessage = document.getElementById("empty-message");

  let category = "all";

  function updateCards() {
    const query = search.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const matchesText = card.textContent.toLowerCase().includes(query);
      const matchesCategory =
        category === "all" || card.dataset.category === category;

      const visible = matchesText && matchesCategory;
      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    document.querySelectorAll(".catalog h2").forEach((heading) => {
      const grid = heading.nextElementSibling;
      if (!grid || !grid.classList.contains("card-grid")) return;

      heading.hidden = ![...grid.querySelectorAll(".tool-card")]
        .some((card) => !card.hidden);
    });

    emptyMessage.hidden = visibleCount !== 0;
  }

  search.addEventListener("input", updateCards);

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      category = button.dataset.filter;

      filters.forEach((filter) => {
        filter.classList.toggle("active", filter === button);
      });

      updateCards();
    });
  });

  updateCards();
})();
