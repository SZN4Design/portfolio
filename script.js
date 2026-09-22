(() => {
  const lines = [...document.querySelectorAll(".zoom-line")];
  const scrollCue = document.getElementById("scrollCue");
  const ctaSection = document.getElementById("ctaSection");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let ticking = false;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function updateLines() {
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    const isMobile = window.innerWidth <= 760;

    lines.forEach((line) => {
      const rect = line.getBoundingClientRect();
      const lineCenter = rect.top + rect.height / 2;
      const distance = Math.abs(viewportCenter - lineCenter);
      const range = viewportHeight * (isMobile ? 0.72 : 0.64);
      const progress = clamp(1 - distance / range, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      const minScale = parseFloat(line.dataset.minScale || "0.80");
      let maxScale = parseFloat(line.dataset.maxScale || "1.08");
      if (isMobile) maxScale = 1 + (maxScale - 1) * 0.55;

      const scale = minScale + (maxScale - minScale) * eased;
      const opacity = 0.24 + 0.76 * eased;
      const blur = 1.6 * (1 - eased);
      const trackingMultiplier = 1.12 - 0.12 * eased;

      line.style.setProperty("--scale", scale.toFixed(4));
      line.style.setProperty("--opacity", opacity.toFixed(4));
      line.style.setProperty("--blur", `${blur.toFixed(2)}px`);
      line.style.setProperty("--tracking-multiplier", trackingMultiplier.toFixed(4));
    });

    if (scrollCue) scrollCue.classList.toggle("is-hidden", window.scrollY > 40);

    const y = window.scrollY;
    document.documentElement.style.setProperty("--ambient-one-y", `${y * 0.028}px`);
    document.documentElement.style.setProperty("--ambient-two-y", `${-y * 0.020}px`);

    ticking = false;
  }

  function requestTick() {
    if (!ticking && !reduceMotion.matches) {
      ticking = true;
      requestAnimationFrame(updateLines);
    }
  }

  const ctaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) ctaSection.classList.add("is-visible");
      });
    },
    { threshold: 0.28 }
  );

  if (ctaSection) ctaObserver.observe(ctaSection);

  function init() {
    if (reduceMotion.matches) {
      if (ctaSection) ctaSection.classList.add("is-visible");
      return;
    }

    updateLines();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });
  }

  reduceMotion.addEventListener?.("change", () => window.location.reload());
  init();
})();
