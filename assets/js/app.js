/* =====================================
Tahaffuz-E-Iman Library
Common JavaScript V2.0 - Complete Features
All Pages Functionality
===================================== */

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  console.log("🕌 Tahaffuz-E-Iman Library Loaded");
  
  initTheme();
  initCounters();
  initScrollTop();
  initSmoothScroll();
  initKeyboardNavigation();
});

/* =====================================
THEME TOGGLE - DARK MODE
===================================== */
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem("theme") || "light";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme !== "light" ? savedTheme : (prefersDark ? "dark" : "light");

  // Apply theme
  if (theme === "dark") {
    document.body.classList.add("dark");
    btn.textContent = "☀️";
  } else {
    document.body.classList.remove("dark");
    btn.textContent = "🌙";
  }

  // Toggle theme on button click
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    btn.textContent = isDark ? "☀️" : "🌙";
    
    // Announce theme change for accessibility
    const announcement = isDark ? "Dark mode enabled" : "Light mode enabled";
    announceToScreenReader(announcement);
  });

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    const theme = e.matches ? "dark" : "light";
    if (localStorage.getItem("theme") === null) {
      if (theme === "dark") {
        document.body.classList.add("dark");
        btn.textContent = "☀️";
      } else {
        document.body.classList.remove("dark");
        btn.textContent = "🌙";
      }
    }
  });
}

/* =====================================
ANIMATED COUNTERS - STATISTICS
===================================== */
function initCounters() {
  const counters = document.querySelectorAll(".stat-card h2");

  // Only animate if element is in viewport
  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        animateCounter(entry.target);
        entry.target.dataset.animated = "true";
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

function animateCounter(counter) {
  const target = parseInt(counter.innerText.replace(/\D/g, ""));
  
  if (isNaN(target)) return;

  let current = 0;
  const step = Math.ceil(target / 100);
  const increment = () => {
    current += step;
    if (current >= target) {
      counter.innerText = target.toLocaleString() + "+";
      return;
    }
    counter.innerText = current.toLocaleString() + "+";
    requestAnimationFrame(increment);
  };

  increment();
}

/* =====================================
SCROLL TO TOP BUTTON
===================================== */
function initScrollTop() {
  const btn = document.getElementById("scroll-top-btn");
  if (!btn) return;

  // Debounce scroll events
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const isVisible = window.scrollY > 300;
      btn.style.display = isVisible ? "flex" : "none";
      
      if (isVisible && !btn.hasAttribute("data-active")) {
        btn.setAttribute("data-active", "true");
      }
    }, 100);
  });

  // Smooth scroll to top
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Keyboard support
  btn.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  });
}

/* =====================================
SMOOTH SCROLL ANCHOR LINKS
===================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      
      // Skip if href is just "#"
      if (href === "#") {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      
      const headerHeight = document.querySelector(".header")?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      // Update URL
      history.pushState(null, null, href);
    });
  });
}

/* =====================================
KEYBOARD NAVIGATION
===================================== */
function initKeyboardNavigation() {
  // Skip to main content with Ctrl+Alt+M or Cmd+Option+M
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === "m") {
      e.preventDefault();
      const main = document.querySelector("main") || document.querySelector("section");
      if (main) {
        main.focus();
        main.tabIndex = -1;
      }
    }

    // Close modals with Escape
    if (e.key === "Escape") {
      const modal = document.getElementById("evidenceModal");
      if (modal && modal.style.display !== "none") {
        modal.style.display = "none";
      }
    }
  });
}

/* =====================================
ACCESSIBILITY HELPERS
===================================== */
function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.className = "sr-only";
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    announcement.remove();
  }, 1000);
}

// Add screen reader only class if not exists
if (!document.querySelector("style:contains('sr-only')")) {
  const style = document.createElement("style");
  style.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `;
  document.head.appendChild(style);
}

/* =====================================
PERFORMANCE MONITORING
===================================== */
if ("performance" in window && "PerformanceObserver" in window) {
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration}ms`);
      });
    });
    observer.observe({ entryTypes: ["measure", "navigation"] });
  } catch (e) {
    console.log("Performance monitoring not available");
  }
}

/* =====================================
OFFLINE DETECTION
===================================== */
window.addEventListener("online", () => {
  console.log("✅ Connection restored");
  showNotification("Connection restored", "success");
});

window.addEventListener("offline", () => {
  console.log("⚠️ No internet connection");
  showNotification("No internet connection - some features may be limited", "warning");
});

/* =====================================
NOTIFICATION SYSTEM
===================================== */
function showNotification(message, type = "info") {
  // Only show in development or if notification element exists
  const existing = document.querySelector(".notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === "success" ? "#10b981" : type === "warning" ? "#f59e0b" : "#3b82f6"};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add notification animations
if (!document.querySelector("style:contains('slideIn')")) {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

/* =====================================
LAZY LOADING IMAGES
===================================== */
function initLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach(img => {
      imageObserver.observe(img);
    });
  }
}

document.addEventListener("DOMContentLoaded", initLazyLoading);

/* =====================================
SERVICE WORKER REGISTRATION
===================================== */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(
      (registration) => {
        console.log("✅ Service Worker registered successfully");
      },
      (err) => {
        console.log("⚠️ Service Worker registration failed:", err);
      }
    );
  });
}

/* =====================================
SCROLL PROGRESS INDICATOR
===================================== */
function initScrollProgress() {
  const progressBar = document.getElementById("scroll-progress");
  if (!progressBar) return;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrollPercent + "%";
  });
}

document.addEventListener("DOMContentLoaded", initScrollProgress);

/* =====================================
FORM VALIDATION HELPERS
===================================== */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateForm(form) {
  let isValid = true;
  form.querySelectorAll("[required]").forEach(field => {
    if (!field.value.trim()) {
      field.setAttribute("aria-invalid", "true");
      isValid = false;
    } else {
      field.setAttribute("aria-invalid", "false");
    }
  });
  return isValid;
}

/* =====================================
DEBOUNCE UTILITY
===================================== */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/* =====================================
THROTTLE UTILITY
===================================== */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* =====================================
LOCAL STORAGE HELPERS
===================================== */
const Storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("LocalStorage error:", e);
    }
  },
  
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error("LocalStorage error:", e);
      return null;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("LocalStorage error:", e);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error("LocalStorage error:", e);
    }
  }
};

/* =====================================
ANALYTICS TRACKER
===================================== */
const Analytics = {
  track: (event, data = {}) => {
    console.log(`📊 Event: ${event}`, data);
    
    // Send to external analytics if configured
    if (window.gtag) {
      window.gtag("event", event, data);
    }
  },
  
  pageView: () => {
    Analytics.track("page_view", {
      page_path: window.location.pathname,
      page_title: document.title
    });
  }
};

// Track page views
document.addEventListener("DOMContentLoaded", () => {
  Analytics.pageView();
});

/* =====================================
EXPORT UTILITIES FOR USE
===================================== */
window.TahaffuzUtils = {
  debounce,
  throttle,
  Storage,
  Analytics,
  validateEmail,
  validateForm,
  showNotification,
  announceToScreenReader
};

console.log("🌟 Tahaffuz-E-Iman Library - All utilities loaded");
