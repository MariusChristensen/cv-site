// Global variables for better performance
let currentLanguage = "no";
let printModal;
let passwordModal;
let currentLinkMode = "links"; // "links" or "qr"
let currentAboutMode = "application"; // "application" or "standard"
let isAdminMode = false; // Admin mode state

// Check if admin mode is enabled via URL parameter
function checkAdminMode() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("admin") === "true") {
    // Ensure admin mode is false while password modal is shown
    isAdminMode = false;
    toggleAdminTabs(); // Hide admin tabs initially
    // Show custom password modal
    showPasswordModal();
  } else {
    isAdminMode = false;
    toggleAdminTabs();
  }
}

// Validate admin password using Netlify function
async function validateAdminPassword(password) {
  try {
    const response = await fetch("/.netlify/functions/admin-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result.valid;
  } catch (error) {
    console.error("Error validating password:", error);
    return false;
  }
}

// Show/hide admin-only tabs based on admin mode
function toggleAdminTabs() {
  const adminTabs = document.querySelectorAll(".admin-tab");
  adminTabs.forEach((tab) => {
    tab.style.display = isAdminMode ? "" : "none";
  });
}

// Language switching functionality
function setLanguage(lang) {
  currentLanguage = lang;
  document.querySelectorAll("[data-lang]").forEach((el) => {
    el.style.display =
      el.getAttribute("data-lang") === lang ? "inline" : "none";
  });

  // Update active language button styling
  document.querySelectorAll(".tab-button").forEach((btn) => {
    const buttonText = btn.textContent.trim();
    if (buttonText === "Norsk" || buttonText === "English") {
      btn.classList.remove("active");
      if (
        (lang === "no" && buttonText === "Norsk") ||
        (lang === "en" && buttonText === "English")
      ) {
        btn.classList.add("active");
      }
    }
  });
}

// Get current language more reliably
function getCurrentLanguage() {
  return currentLanguage;
}

// Link mode functionality (Links vs QR Codes)
function setLinkMode(mode) {
  currentLinkMode = mode;
  const linkMode = document.querySelector(".link-mode");
  const qrModeDiv = document.querySelector(".qr-mode");

  if (mode === "qr") {
    // Switch to QR mode
    linkMode.style.display = "none";
    qrModeDiv.style.display = "block";
    generateQRCodes();
  } else {
    // Switch to link mode
    linkMode.style.display = "block";
    qrModeDiv.style.display = "none";
  }

  // Update active button states
  updateLinkModeButtons();
}

// About section functionality (Application vs Standard CV)
function setAboutMode(mode) {
  currentAboutMode = mode;
  const openApplicationSection = document.getElementById(
    "open-application-section"
  );
  const aboutMeSection = document.getElementById("about-me-section");

  if (mode === "standard") {
    // Switch to traditional CV mode
    openApplicationSection.style.display = "none";
    aboutMeSection.style.display = "block";
  } else {
    // Switch to open application mode
    openApplicationSection.style.display = "block";
    aboutMeSection.style.display = "none";
  }

  // Update active button states
  updateAboutModeButtons();
}

// Update active states for link mode buttons
function updateLinkModeButtons() {
  const linksBtn = document.getElementById("links-btn");
  const qrBtn = document.getElementById("qr-btn");

  linksBtn.classList.toggle("active", currentLinkMode === "links");
  qrBtn.classList.toggle("active", currentLinkMode === "qr");
}

// Update active states for about mode buttons
function updateAboutModeButtons() {
  const applicationBtn = document.getElementById("application-btn");
  const standardBtn = document.getElementById("standard-btn");

  applicationBtn.classList.toggle("active", currentAboutMode === "application");
  standardBtn.classList.toggle("active", currentAboutMode === "standard");
}

// Generate QR codes using QR Server API
function generateQRCodes() {
  const githubImg = document.getElementById("github-qr");
  const portfolioImg = document.getElementById("portfolio-qr");

  // Generate GitHub QR code
  const githubUrl = encodeURIComponent("https://github.com/MariusChristensen");
  githubImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=85x85&data=${githubUrl}`;

  // Generate Portfolio QR code
  const portfolioUrl = encodeURIComponent(
    "https://mariusc-portfolio.netlify.app/"
  );
  portfolioImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=85x85&data=${portfolioUrl}`;
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
• Aktiver "Bakgrunnsgrafikk" hvis tilgjengelig`,
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

// Password modal functions
function showPasswordModal() {
  passwordModal.classList.add("show");
  // Focus on input and clear any previous value
  const input = document.getElementById("passwordInput");
  input.value = "";
  setTimeout(() => input.focus(), 100);

  // Handle Enter key submission
  input.onkeydown = function (e) {
    if (e.key === "Enter") {
      submitPassword();
    }
  };
}

function hidePasswordModal() {
  passwordModal.classList.remove("show");
}

async function submitPassword() {
  const password = document.getElementById("passwordInput").value;

  if (!password) {
    return;
  }

  try {
    const isValid = await validateAdminPassword(password);

    if (isValid) {
      isAdminMode = true;
      console.log("Admin mode activated");
      hidePasswordModal();
      toggleAdminTabs();
    } else {
      // Show error styling
      const input = document.getElementById("passwordInput");
      input.style.borderColor = "#e74c3c";
      input.style.backgroundColor = "#fdf2f2";

      // Reset styling after 2 seconds
      setTimeout(() => {
        input.style.borderColor = "";
        input.style.backgroundColor = "";
      }, 2000);

      // Clear input
      input.value = "";
      input.focus();
    }
  } catch (error) {
    console.error("Error during password validation:", error);
    cancelPassword();
  }
}

function cancelPassword() {
  isAdminMode = false;
  hidePasswordModal();
  toggleAdminTabs();
}

// Initialize when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  // Initialize DOM references
  printModal = document.getElementById("printModal");
  passwordModal = document.getElementById("passwordModal");

  // Check admin mode from URL
  checkAdminMode();

  // Auto-detect browser language and set active button
  const preferred = navigator.language.startsWith("no") ? "no" : "en";
  setLanguage(preferred);

  // Set default modes and update button states
  setLinkMode("links"); // Default to links mode
  setAboutMode("application"); // Default to application mode
});
