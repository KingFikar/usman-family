/* ==========================================================================
   Usman Baco Family - main.js
   Modul vanilla JS, tanpa dependency.
   Sections:
     1. Helpers
     2. Theme (light / dark / system)
     3. Header & mobile nav
     4. Reveal on scroll
     5. Animated counters
     6. Gallery filter
     7. Lightbox
     8. Contact form
     9. Back to top
    10. Footer year
    11. Bootstrap
   ========================================================================== */

(function () {
  "use strict";

  /* 1. Helpers ========================================================== */

  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) =>
    Array.prototype.slice.call((scope || document).querySelectorAll(selector));

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let toastTimer = null;

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    const text = $("[data-toast-text]", toast);
    if (text) text.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 3200);
  }

  /* 2. Theme ============================================================ */

  const THEME_KEY = "usman-theme";

  function readStoredTheme() {
    try {
      return window.localStorage.getItem(THEME_KEY);
    } catch (err) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      window.localStorage.setItem(THEME_KEY, value);
    } catch (err) {
      /* localStorage bisa diblokir, abaikan saja */
    }
  }

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const meta = $('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#16130f" : "#f8f4ec");
    }
  }

  function initTheme() {
    const stored = readStoredTheme();
    applyTheme(stored || systemTheme());

    const toggle = $(".theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      const current =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "dark"
          : "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      storeTheme(next);
    });

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function (event) {
        if (!readStoredTheme()) applyTheme(event.matches ? "dark" : "light");
      });
  }

  /* 3. Header & mobile nav ============================================== */

  function initHeader() {
    const header = $(".site-header");
    const toggle = $(".nav-toggle");
    const panel = $(".mobile-nav");

    if (header) {
      const onScroll = function () {
        header.classList.toggle("is-stuck", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (!toggle || !panel) return;

    const setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("is-open", open);
      document.body.classList.toggle("is-locked", open);
      toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    $$("a", panel).forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 940) setOpen(false);
    });
  }

  /* 4. Reveal on scroll ================================================= */

  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* 5. Animated counters =============================================== */

  function animateCounter(element) {
    const target = parseFloat(element.dataset.count);
    const suffix = element.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const step = function (now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = $$("[data-count]");
    if (!counters.length) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      counters.forEach(function (counter) {
        counter.textContent = counter.dataset.count + (counter.dataset.suffix || "");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  /* 6. Gallery filter ================================================== */

  function initGalleryFilter() {
    const buttons = $$("[data-filter]");
    const shots = $$("[data-category]");
    if (!buttons.length || !shots.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const filter = button.dataset.filter;

        buttons.forEach(function (item) {
          item.setAttribute("aria-pressed", String(item === button));
        });

        shots.forEach(function (shot) {
          const match = filter === "all" || shot.dataset.category === filter;
          shot.hidden = !match;
        });
      });
    });
  }

  /* 7. Lightbox ======================================================== */

  function initLightbox() {
    const lightbox = $("#lightbox");
    const shots = $$(".shot");
    if (!lightbox || !shots.length) return;

    const image = $("[data-lightbox-image]", lightbox);
    const title = $("[data-lightbox-title]", lightbox);
    const caption = $("[data-lightbox-caption]", lightbox);
    let index = 0;
    let lastFocused = null;

    const visibleShots = function () {
      return shots.filter(function (shot) {
        return !shot.hidden;
      });
    };

    const render = function (target) {
      const list = visibleShots();
      if (!list.length) return;
      index = Math.max(0, list.indexOf(target));
      const current = list[index];
      const src = $("img", current);
      if (!src) return;

      if (image) {
        image.src = src.currentSrc || src.src;
        image.alt = src.alt || "";
      }
      if (title) title.textContent = current.dataset.title || "";
      if (caption) caption.textContent = current.dataset.caption || "";
    };

    const open = function (target) {
      lastFocused = document.activeElement;
      render(target);
      lightbox.classList.add("is-open");
      document.body.classList.add("is-locked");
      const closeBtn = $(".lightbox__btn--close", lightbox);
      if (closeBtn) closeBtn.focus();
    };

    const close = function () {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("is-locked");
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    };

    const step = function (direction) {
      const list = visibleShots();
      if (!list.length) return;
      index = (index + direction + list.length) % list.length;
      render(list[index]);
    };

    shots.forEach(function (shot) {
      shot.addEventListener("click", function () {
        open(shot);
      });
    });

    const closeBtn = $(".lightbox__btn--close", lightbox);
    const prevBtn = $(".lightbox__btn--prev", lightbox);
    const nextBtn = $(".lightbox__btn--next", lightbox);

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (prevBtn) prevBtn.addEventListener("click", function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { step(1); });

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) close();
    });

    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    });
  }

  /* 8. Contact form ==================================================== */

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setFieldError(field, message) {
    const wrapper = field.closest(".field");
    if (!wrapper) return;
    const error = $(".error", wrapper);
    wrapper.classList.toggle("has-error", Boolean(message));
    if (error) error.textContent = message || "";
  }

  function validateField(field) {
    const value = (field.value || "").trim();

    if (field.required && !value) {
      setFieldError(field, "Kolom ini wajib diisi.");
      return false;
    }

    if (!value) {
      setFieldError(field, "");
      return true;
    }

    if (field.type === "email" && !EMAIL_PATTERN.test(value)) {
      setFieldError(field, "Format email belum benar.");
      return false;
    }

    if (field.type === "tel" && !/^[0-9+\-\s()]{8,20}$/.test(value)) {
      setFieldError(field, "Nomor telepon belum valid.");
      return false;
    }

    setFieldError(field, "");
    return true;
  }

  function initForm() {
    const form = $("#contact-form");
    if (!form) return;

    const status = $(".form-status", form);
    const fields = $$("input, textarea, select", form).filter(function (field) {
      return field.type !== "submit" && field.type !== "hidden";
    });

    fields.forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
      field.addEventListener("input", function () {
        const wrapper = field.closest(".field");
        if (wrapper && wrapper.classList.contains("has-error")) validateField(field);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      let valid = true;
      let firstInvalid = null;

      fields.forEach(function (field) {
        if (!validateField(field)) {
          valid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!valid) {
        if (status) {
          status.className = "form-status is-bad";
          status.textContent = "Ada kolom yang perlu diperbaiki. Periksa kembali data Anda.";
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (status) {
        status.className = "form-status is-ok";
        status.textContent =
          "Terima kasih! Pesan Anda sudah tercatat. Kami akan membalas dalam 2x24 jam.";
      }

      form.reset();
      showToast("Pesan berhasil dikirim");
    });
  }

  /* 9. Back to top ====================================================== */

  function initToTop() {
    const button = $(".to-top");
    if (!button) return;

    const onScroll = function () {
      button.classList.toggle("is-visible", window.scrollY > 700);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth"
      });
    });
  }

  /* 10. Footer year ==================================================== */

  function initYear() {
    $$("[data-year]").forEach(function (element) {
      element.textContent = String(new Date().getFullYear());
    });
  }

  /* 11. Bootstrap ====================================================== */

  function init() {
    initTheme();
    initHeader();
    initReveal();
    initCounters();
    initGalleryFilter();
    initLightbox();
    initForm();
    initToTop();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
