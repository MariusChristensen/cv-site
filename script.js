// Language switching functionality
function setLanguage(lang) {
  document.querySelectorAll("[data-lang]").forEach((el) => {
    el.style.display =
      el.getAttribute("data-lang") === lang ? "inline" : "none";
  });
}

// Print to PDF functionality
function printCV() {
  window.print();
}

// Auto-detect browser language on page load
window.addEventListener("DOMContentLoaded", () => {
  const preferred = navigator.language.startsWith("no") ? "no" : "en";
  setLanguage(preferred);
});
