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

  // Original Niebla WebGL 3D mark. The same canvas stays mounted while its
  // pose changes with the active section; no CSS sphere or image substitute.
  const stage = document.getElementById("stage");
  const canvas = document.getElementById("heroCanvas");
  if (stage && canvas) {
    try {
      const api = window.NieblaSymbol?.init(canvas, { scroll: 0.0012, stage: true });
      if (!api) stage.classList.add("no-webgl");
      else {
        const sections = [...document.querySelectorAll("[data-pose]")];
        let active = sections[0] || null;
        const applyPose = section => {
          if (!section) return;
          const pose = JSON.parse(section.dataset.pose);
          if (window.innerWidth < 860) {
            pose.x = 1.25;
            pose.y = -0.55;
            pose.zoom *= 0.62;
            pose.a = Math.min(pose.a, 0.48);
          }
          api.pose(pose);
        };
        applyPose(active);
        if ("IntersectionObserver" in window) {
          const observer = new IntersectionObserver(entries => {
            const visible = entries.filter(entry => entry.isIntersecting)
              .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible && visible.target !== active) {
              active = visible.target;
              applyPose(active);
            }
          }, { threshold: [0.2, 0.4, 0.6] });
          sections.forEach(section => observer.observe(section));
        }
        window.addEventListener("resize", () => applyPose(active), { passive: true });
      }
    } catch (error) {
      console.error("Niebla WebGL 3D:", error);
      stage.classList.add("no-webgl");
    }
  }

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