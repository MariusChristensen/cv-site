// Global variables for better performance
let currentLanguage = "no";
let printModal;

// Language switching functionality
function setLanguage(lang) {
  currentLanguage = lang;
  document.querySelectorAll("[data-lang]").forEach((el) => {
    el.style.display =
      el.getAttribute("data-lang") === lang ? "inline" : "none";
  });
}

// Get current language more reliably
function getCurrentLanguage() {
  return currentLanguage;
}

// Print to PDF functionality
function printCV() {
  const lang = getCurrentLanguage();

  const content = {
    no: {
      title: "Utskriftsinstruksjoner",
      message: `For best resultat:
• Velg "Lagre som PDF" som destinasjon
• Sett marginer til "Ingen" eller "Minimum"
• Aktiver "Bakgrunnsgrafik" hvis tilgjengelig`,
    },
    en: {
      title: "Print Instructions",
      message: `For best results:
• Select "Save as PDF" as destination
• Set margins to "None" or "Minimum"
• Enable "Background graphics" if available`,
    },
  };

  // Update modal content
  document.getElementById("modalTitle").textContent = content[lang].title;
  document.getElementById("modalText").innerHTML = content[
    lang
  ].message.replace(/\n/g, "<br>");

  // Show modal
  printModal.classList.add("show");
}

function confirmPrint() {
  hideModal();
  window.print();
}

function cancelPrint() {
  hideModal();
}

// DRY: Extract modal hiding logic
function hideModal() {
  printModal.classList.remove("show");
}

// Initialize when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  // Initialize DOM references
  printModal = document.getElementById("printModal");

  // Auto-detect browser language
  const preferred = navigator.language.startsWith("no") ? "no" : "en";
  setLanguage(preferred);
});
