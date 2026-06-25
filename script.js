/* =============================================
   MAISON INTERIOR STUDIO – JAVASCRIPT
   ============================================= */

/* ── Loading Screen Controller ── */
document.addEventListener("DOMContentLoaded", () => {
  const loaderOverlay = document.getElementById("loaderOverlay");
  const loaderBar = document.getElementById("loaderBar");

  if (!loaderOverlay || !loaderBar) return;

  const startTime = Date.now();

  // Prevent scrolling during loading
  document.body.style.overflow = "hidden";

  let progress = 0;

  // Fake progress increments before complete page load
  const progressInterval = setInterval(() => {
    if (progress < 85) {
      progress += Math.floor(Math.random() * 10) + 3;
      if (progress > 85) progress = 85;
      loaderBar.style.width = `${progress}%`;
    }
  }, 150);

  window.addEventListener("load", () => {
    clearInterval(progressInterval);
    loaderBar.style.width = "100%";

    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, 1000 - elapsedTime);

    // Smooth transition delays ensuring at least 2 seconds of display time
    setTimeout(() => {
      loaderOverlay.classList.add("fade-out");
      document.body.style.overflow = "";
    }, remainingTime);
  });
});

/* ── Navbar scroll effect ── */
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  hamburger.classList.toggle("active");
  const isOpen = navLinks.classList.contains("open");
  hamburger.setAttribute("aria-expanded", isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? "hidden" : "";
});

/* Close nav when a link is clicked */
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document
      .querySelectorAll(".nav-link")
      .forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

/* ── Active nav on scroll ── */
const sections = document.querySelectorAll("section[id], footer[id]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        document.querySelectorAll(".nav-link").forEach((l) => {
          l.classList.toggle("active", l.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35, rootMargin: "-60px 0px 0px 0px" }
);

sections.forEach((sec) => observer.observe(sec));

/* ── Gallery Slider ── */
const slides = document.querySelectorAll(".gallery-slide");
const prevBtn = document.getElementById("galleryPrev");
const nextBtn = document.getElementById("galleryNext");
const tabs = document.querySelectorAll(".gallery-tab");
let currentSlide = 0;
let autoplayTimer;

function goToSlide(index) {
  slides[currentSlide].classList.remove("active");
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
}

function startAutoplay() {
  autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 4500);
}
function stopAutoplay() {
  clearInterval(autoplayTimer);
}

prevBtn.addEventListener("click", () => {
  stopAutoplay();
  goToSlide(currentSlide - 1);
  startAutoplay();
});
nextBtn.addEventListener("click", () => {
  stopAutoplay();
  goToSlide(currentSlide + 1);
  startAutoplay();
});

/* Gallery tab switching */
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active", "active-count"));
    tab.classList.add("active");
    const idx = Math.min(i, slides.length - 1);
    stopAutoplay();
    goToSlide(idx);
    startAutoplay();
  });
});

/* Touch / swipe support */
let touchStartX = 0;
const sliderEl = document.querySelector(".gallery-slider");
sliderEl.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.touches[0].clientX;
  },
  { passive: true }
);
sliderEl.addEventListener(
  "touchend",
  (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
    }
  },
  { passive: true }
);

startAutoplay();

/* ── Scroll Reveal Animation ── */
const revealEls = document.querySelectorAll(".reveal");
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => revealObs.observe(el));

/* ── Add reveal classes dynamically ── */
function addReveal(selector, delay = '') {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add("reveal");
    if (delay) el.classList.add(`reveal-delay-${(i % 3) + 1}`);
  });
}
addReveal(".about-left", false);
addReveal(".about-right", false);
addReveal(".how-left", false);
addReveal(".how-right", false);
addReveal(".stat-item", true);
addReveal(".step-card", true);
addReveal(".img-card", true);
addReveal(".bento-item", true);
addReveal(".service-card", true);
addReveal(".ba-card", true);
addReveal(".footer-col", true);

/* Re-run observer after adding classes */
document.querySelectorAll(".reveal").forEach((el) => {
  if (!el.classList.contains("visible")) revealObs.observe(el);
});

/* ── Newsletter form ── */
document.getElementById("newsletter-btn").addEventListener("click", () => {
  const input = document.getElementById("newsletter-email");
  const val = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val || !emailRegex.test(val)) {
    input.style.borderColor = "#e74c3c";
    input.placeholder = 'Please enter a valid email';
    setTimeout(() => {
      input.style.borderColor = "";
      input.placeholder = "Enter your email";
    }, 2500);
    return;
  }
  input.value = "";
  input.placeholder = "✓ Subscribed! Thank you.";
  setTimeout(() => {
    input.placeholder = "Enter your email";
  }, 3500);
});

/* ── Smooth hover underline for footer links ── */
document.querySelectorAll(".footer-list a").forEach((link) => {
  link.style.transition = "color 0.25s ease, padding-left 0.25s ease";
});

/* ── Stats Counter Animation ── */
function animateCounter(el, target) {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + "+";
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".stat-num").forEach((el) => {
          const num = parseInt(el.textContent);
          if (!isNaN(num)) animateCounter(el, num);
        });
        statsObs.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);

const statsGrid = document.querySelector(".stats-grid");
if (statsGrid) statsObs.observe(statsGrid);

/* ── Parallax on hero image ── */
window.addEventListener(
  "scroll",
  () => {
    const heroImg = document.querySelector(".hero-img");
    if (!heroImg) return;
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroImg.style.transform = `scale(1) translateY(${scrollY * 0.2}px)`;
    }
  },
  { passive: true }
);



/* ── WhatsApp Form Submission Handler ── */
const whatsappForm = document.getElementById("whatsappForm");
if (whatsappForm) {
  whatsappForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("userName").value.trim();
    const phone = document.getElementById("userPhone").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const location = document.getElementById("userLocation").value.trim();
    const projectType = document.getElementById("projectType").value;
    const msg = document.getElementById("projectMessage").value.trim();

    // Format message text for WhatsApp API
    let textMessage = `Hello MAISON Interior Studio, I'd like to book a design consultation.\n\n`;
    textMessage += `*Name:* ${name}\n`;
    textMessage += `*Phone:* ${phone}\n`;
    if (email) textMessage += `*Email:* ${email}\n`;
    if (location) textMessage += `*Location:* ${location}\n`;
    textMessage += `*Project Type:* ${projectType}\n`;
    if (msg) textMessage += `*Message:* ${msg}`;

    const encodedText = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/919717218294?text=${encodedText}`;

    // Open WhatsApp URL in new window/tab
    window.open(whatsappUrl, "_blank");
  });
}