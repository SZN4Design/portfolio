(() => {
  const reveals = [...document.querySelectorAll(".reveal")];
  const focusLines = [...document.querySelectorAll(".focus-line")];
  const imageFocus = [...document.querySelectorAll(".image-focus")];
  const progressBar = document.getElementById("progressBar");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Basic reveal observer ---
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -5% 0px" }
  );

  reveals.forEach(el => revealObserver.observe(el));

  if (reduceMotion) {
    focusLines.forEach(el => el.classList.add("is-focused"));
    reveals.forEach(el => el.classList.add("is-visible"));
    return;
  }

  let ticking = false;

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  function updateScrollEffects() {
    const vh = window.innerHeight;
    const center = vh / 2;
    const maxScroll = document.documentElement.scrollHeight - vh;

    // Progress indicator.
    if (progressBar) {
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      progressBar.style.width = `${clamp(progress, 0, 1) * 100}%`;
    }

    // Focus typography: strongest when a sentence reaches the viewport center.
    focusLines.forEach(line => {
      const r = line.getBoundingClientRect();
      const c = r.top + r.height / 2;
      const distance = Math.abs(center - c);
      const p = clamp(1 - distance / (vh * .46), 0, 1);

      line.classList.toggle("is-focused", p > .46);

      // Fine-grained scale gives a "coming into focus" feel.
      const scale = .94 + .06 * p;
      line.style.transform = `scale(${scale.toFixed(4)})`;
      line.style.opacity = (0.42 + 0.58 * p).toFixed(3);
    });

    // Image breathing: subtle scale only, intentionally not dramatic.
    imageFocus.forEach(card => {
      const r = card.getBoundingClientRect();
      const c = r.top + r.height / 2;
      const distance = Math.abs(center - c);
      const p = clamp(1 - distance / (vh * .82), 0, 1);
      const scale = .965 + .035 * p;
      card.style.setProperty("--image-scale", scale.toFixed(4));
      // preserve reveal translate/filter after it becomes visible
      if (card.classList.contains("is-visible")) {
        card.style.transform = `scale(${scale.toFixed(4)})`;
      }
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScrollEffects);
    }
  }

  updateScrollEffects();
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick, { passive: true });
})();


// Contact form success state after FormSubmit redirect.
(() => {
  const params = new URLSearchParams(window.location.search);
  const success = document.getElementById("formSuccess");

  if (params.get("sent") === "1" && success) {
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });

    // Keep the URL tidy after showing confirmation.
    window.history.replaceState({}, document.title, window.location.pathname + "#contact");
  }
})();
