function setLanguage(lang) {
  document.querySelectorAll("[data-lang]").forEach((el) => {
    el.style.display = el.getAttribute("data-lang") === lang ? "" : "none";
  });
}

// Automatisk språkvalg basert på nettleser
window.addEventListener("DOMContentLoaded", () => {
  const preferred = navigator.language.startsWith("no") ? "no" : "en";
  setLanguage(preferred);
});
