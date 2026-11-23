(() => {
  const menu = document.getElementById("menuBtn");
  const nav = document.getElementById("navLinks");

  if (menu && nav) {
    const closeMenu = () => {
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Abrir menú");
      nav.classList.remove("open");
    };
    menu.addEventListener("click", () => {
      const isOpen = menu.getAttribute("aria-expanded") !== "true";
      menu.setAttribute("aria-expanded", String(isOpen));
      menu.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
      nav.classList.toggle("open", isOpen);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        closeMenu();
        menu.focus();
      }
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const config = window.NIEBLA_CONFIG || {};
  const email = config.contact?.email || "nieblastudiosrd@gmail.com";
  const emailCta = document.getElementById("emailCta");
  if (emailCta) {
    emailCta.href = "mailto:" + email + "?subject=" + encodeURIComponent("Proyecto - Niebla Studios");
  }

  const header = document.querySelector(".site-header");
  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 16);
      scrollTicking = false;
    });
  }, { passive: true });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const revealTargets = document.querySelectorAll(
    ".manifesto-label, .manifesto-content, .section-top, .service-feature, .services-foot, " +
    ".cap-header, .cap-title, .principles article, .process-heading, .process-track article, " +
    ".studio-top, .studio-main, .team-intro, .team-member, .faq-heading, .faq-items details, " +
    ".contact-top, .contact h2, .contact-bottom"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealTargets.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.transitionDelay = (index % 4) * 65 + "ms";
      observer.observe(element);
    });
  }

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const visual = document.querySelector(".hero-visual");
  if (visual) {
    const particlePositions = [
      ["-34%", "-25%", "55px", "8s", "0s"],
      ["31%", "-36%", "-20px", "11s", "-3s"],
      ["38%", "24%", "70px", "9s", "-5s"],
      ["-29%", "36%", "-35px", "12s", "-2s"],
      ["4%", "-47%", "30px", "10s", "-6s"],
      ["-48%", "4%", "15px", "13s", "-4s"],
      ["48%", "-5%", "-10px", "8.5s", "-1s"],
      ["3%", "48%", "45px", "11s", "-7s"]
    ];
    particlePositions.forEach(([x, y, z, duration, delay]) => {
      const particle = document.createElement("span");
      particle.className = "hero-particle";
      particle.setAttribute("aria-hidden", "true");
      particle.style.setProperty("--x", x);
      particle.style.setProperty("--y", y);
      particle.style.setProperty("--z", z);
      particle.style.setProperty("--duration", duration);
      particle.style.setProperty("--delay", delay);
      visual.appendChild(particle);
    });

    if (finePointer) {
      let frame = 0;
      visual.addEventListener("pointermove", event => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const bounds = visual.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          visual.style.transform = "translateY(-52%) rotateX(" + (-y * 7).toFixed(2) + "deg) rotateY(" + (x * 9).toFixed(2) + "deg)";
        });
      });
      visual.addEventListener("pointerleave", () => {
        if (frame) cancelAnimationFrame(frame);
        visual.style.transform = "";
      });
    }
  }

  if (finePointer) {
    document.querySelectorAll("[data-tilt]").forEach(card => {
      let frame = 0;
      card.addEventListener("pointermove", event => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = "perspective(1400px) rotateX(" + (-y * 1.3).toFixed(2) + "deg) rotateY(" + (x * 1.3).toFixed(2) + "deg)";
        });
      });
      card.addEventListener("pointerleave", () => {
        if (frame) cancelAnimationFrame(frame);
        card.style.transform = "";
      });
    });
  }
})();