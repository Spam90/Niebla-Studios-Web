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
  let last = 0;
  window.addEventListener("scroll", () => {
    const current = window.scrollY;
    if (header) header.classList.toggle("scrolled", current > 20);
    last = current;
  }, {passive:true});
})();