(() => {
  const menu = document.getElementById("menuBtn");
  const nav = document.getElementById("navLinks");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") !== "true";
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      nav.classList.toggle("open", open);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Abrir menú");
      nav.classList.remove("open");
    }));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
        menu.focus();
      }
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  const config = window.NIEBLA_CONFIG || {};
  const email = config.contact?.email || "nieblastudiosrd@gmail.com";
  const emailCta = document.getElementById("emailCta");
  if (emailCta) emailCta.href = "mailto:" + email + "?subject=" + encodeURIComponent("Proyecto - Niebla Studios");

  const header = document.querySelector(".header");
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (header) header.classList.toggle("scrolled", window.scrollY > 20);
      ticking = false;
    });
  }, { passive: true });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  // Scroll reveals: content stays visible if scripting or IntersectionObserver is unavailable.
  const revealTargets = document.querySelectorAll(
    ".intro-grid > div, .section-heading, .service-panel, .service-note, .project-card, " +
    ".process-list article, .about-top, .about h2, .about-bottom, .team-role, .faq-grid > div, .contact h2, .contact-bottom"
  );
  if ("IntersectionObserver" in window) {
    document.body.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -45px 0px" });
    revealTargets.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", (index % 4) * 75 + "ms");
      revealObserver.observe(element);
    });
  }

  const visual = document.querySelector(".hero-visual");
  if (visual) {
    for (let i = 1; i <= 8; i++) {
      const particle = document.createElement("span");
      particle.className = "hero-particle";
      particle.setAttribute("aria-hidden", "true");
      visual.appendChild(particle);
    }
    // Pointer-driven depth on desktop; disabled for touch and reduced-motion users.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (finePointer) {
      let frame = 0;
      visual.addEventListener("pointermove", event => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const bounds = visual.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - .5;
          const y = (event.clientY - bounds.top) / bounds.height - .5;
          visual.style.transform = "translateY(-52%) rotateX(" + (-y * 7).toFixed(2) + "deg) rotateY(" + (x * 9).toFixed(2) + "deg)";
          visual.style.setProperty("--pointer-x", (x * 18).toFixed(1) + "px");
          visual.style.setProperty("--pointer-y", (y * 18).toFixed(1) + "px");
        });
      });
      visual.addEventListener("pointerleave", () => {
        if (frame) cancelAnimationFrame(frame);
        visual.style.transform = "";
      });
    }
  }

  // Subtle perspective response on service cards, not on touch devices.
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".service-panel").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = "perspective(900px) translateY(-5px) rotateX(" + (-y * 2.2).toFixed(2) + "deg) rotateY(" + (x * 2.2).toFixed(2) + "deg)";
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }
})();