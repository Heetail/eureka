
(function () {
  const savedTheme = localStorage.getItem("smartverktyg-theme") || "dark";

  function applyTheme(theme) {
    const resolved = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark")
      : theme;

    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }

  window.applySmartverktygTheme = applyTheme;
  applyTheme(savedTheme);

  window.addEventListener("storage", (event) => {
    if (event.key === "smartverktyg-theme" && event.newValue) {
      applyTheme(event.newValue);
    }
  });
})();
