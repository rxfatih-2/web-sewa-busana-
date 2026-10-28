/* =========================================================
   WASTRA — Main Script
   ========================================================= */

(function () {
  "use strict";

  /* ============ 1. HEADER SCROLL EFFECT ============ */
  const header = document.getElementById("header");

  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ============ 2. HAMBURGER MENU ============ */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navLinks = navMenu.querySelectorAll("a");

  function toggleMenu(force) {
    const isOpen =
      typeof force === "boolean"
        ? force
        : !navMenu.classList.contains("open");

    navMenu.classList.toggle("open", isOpen);
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
    hamburger.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");

    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  hamburger.addEventListener("click", function () {
    toggleMenu();
  });

  // Close menu when a link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      toggleMenu(false);
    });
  });

  // Close menu on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      toggleMenu(false);
      hamburger.focus();
    }
  });

  // Close menu when clicking outside (backdrop area)
  navMenu.addEventListener("click", function (e) {
    if (e.target === navMenu) {
      toggleMenu(false);
    }
  });

  /* ============ 3. REVEAL ON SCROLL ============ */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for very old browsers
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ============ 4. ACTIVE NAV LINK ON SCROLL ============ */
  const sections = document.querySelectorAll("section[id]");
  const menuLinks = document.querySelectorAll(".nav-menu ul a");

  function setActiveLink() {
    const scrollY = window.scrollY + 120;

    let currentId = "";
    sections.forEach(function (section) {
      if (scrollY >= section.offsetTop) {
        currentId = section.getAttribute("id");
      }
    });

    menuLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentId) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveLink, { passive: true });
  window.addEventListener("load", setActiveLink);

  /* ============ 5. BOOKING FORM ============ */
  const form = document.getElementById("bookingForm");
  const toast = document.getElementById("toast");

  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 4200);
  }

  function markInvalid(field, isInvalid) {
    field.classList.toggle("invalid", isInvalid);
  }

  // Prevent selecting past dates
  const dateInput = document.getElementById("tanggal");
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = yyyy + "-" + mm + "-" + dd;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nama = form.querySelector("#nama");
      const wa = form.querySelector("#wa");
      const tanggal = form.querySelector("#tanggal");
      const busana = form.querySelector("#busana");

      // Reset
      [nama, wa, tanggal, busana].forEach(function (el) {
        markInvalid(el, false);
      });

      let isValid = true;

      if (!nama.value.trim() || nama.value.trim().length < 3) {
        markInvalid(nama, true);
        isValid = false;
      }

      // Simple Indonesian phone check: 08xx or 628xx, 9-15 digits
      const phoneClean = wa.value.replace(/[\s\-()]/g, "");
      if (!/^(0|62)8[0-9]{8,13}$/.test(phoneClean)) {
        markInvalid(wa, true);
        isValid = false;
      }

      if (!tanggal.value) {
        markInvalid(tanggal, true);
        isValid = false;
      }

      if (!busana.value) {
        markInvalid(busana, true);
        isValid = false;
      }

      if (!isValid) {
        showToast("Mohon lengkapi data dengan benar.");
        const firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulasi sukses — ganti dengan fetch ke API bila sudah tersedia
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      btn.disabled = true;
      btn.textContent = "Mengirim...";

      setTimeout(function () {
        btn.disabled = false;
        btn.textContent = originalText;

        showToast(
          "Terima kasih, " +
            nama.value.trim().split(" ")[0] +
            "! Tim kami akan menghubungi Anda dalam 1×24 jam."
        );

        form.reset();
        [nama, wa, tanggal, busana].forEach(function (el) {
          markInvalid(el, false);
        });
      }, 1200);
    });

    // Clear invalid state on input
    ["nama", "wa", "tanggal", "busana"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", function () {
          markInvalid(el, false);
        });
        el.addEventListener("change", function () {
          markInvalid(el, false);
        });
      }
    });
  }

  /* ============ 6. FOOTER YEAR ============ */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ============ 7. SMOOTH ANCHOR (fallback) ============ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId === "#!") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerOffset = 90;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });
})();
