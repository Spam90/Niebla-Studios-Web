/* Niebla Studios — comportamiento de la web.
   Los datos del sitio se toman de js/config.js (window.NIEBLA_CONFIG). */
(function(){
"use strict";

const CONFIG = window.NIEBLA_CONFIG || {};
const CONTACT = CONFIG.contact || {};
const FORM_ENDPOINT = (CONFIG.form && CONFIG.form.endpoint) || "";

const $ = id => document.getElementById(id);
const header = $("siteHeader");
const menuToggle = $("menuToggle");
const siteNav = $("siteNav");
const form = $("contactForm");
const submitBtn = $("submitBtn");
const formStatus = $("formStatus");

/* ---------- Cabecera al hacer scroll ---------- */
function onScroll(){ header.classList.toggle("scrolled", window.scrollY > 8); }
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Menú móvil con foco atrapado ---------- */
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
function isMobileMenuOpen(){ return menuToggle.getAttribute("aria-expanded") === "true"; }

function setMenu(open){
  siteNav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  document.body.style.overflow = open ? "hidden" : "";
  if (open){
    const first = siteNav.querySelector(FOCUSABLE);
    if (first) first.focus();
  }
}

menuToggle.addEventListener("click", () => setMenu(!isMobileMenuOpen()));
siteNav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });

document.addEventListener("keydown", e => {
  if (!isMobileMenuOpen()) return;
  if (e.key === "Escape"){
    setMenu(false);
    menuToggle.focus();
    return;
  }
  if (e.key === "Tab"){
    const items = [menuToggle, ...siteNav.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
});

window.matchMedia("(min-width: 861px)").addEventListener("change", e => { if (e.matches) setMenu(false); });

/* ---------- Canales de contacto ---------- */
function setChannel(el, href, pendingText){
  if (href){
    el.href = href;
    el.removeAttribute("aria-disabled");
    el.removeAttribute("tabindex");
  } else {
    el.href = "#contacto";
    el.setAttribute("aria-disabled", "true");
    el.setAttribute("tabindex", "-1");
    if (pendingText) el.textContent = pendingText;
  }
}

function wireChannels(){
  const digits = String(CONTACT.whatsapp || "").replace(/\D/g, "");
  const waHref = digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(CONTACT.whatsappMessage || "")}`
    : "";
  const mailHref = CONTACT.email ? `mailto:${CONTACT.email}` : "";

  setChannel($("whatsappLink"), waHref);
  setChannel($("footerWhatsapp"), waHref, "WhatsApp: pendiente");
  setChannel($("emailLink"), mailHref);
  setChannel($("footerEmail"), mailHref, "Correo: pendiente");
}

/* ---------- Validación del formulario ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const rules = {
  fName: { check: v => v.trim().length >= 2, msg: "Escribe tu nombre." },
  fEmail: { check: v => EMAIL_RE.test(v.trim()), msg: "Escribe un correo válido." },
  fMessage: { check: v => v.trim().length >= 10, msg: "Cuéntanos un poco más (mínimo 10 caracteres)." }
};

function validateField(input){
  const rule = rules[input.id];
  if (!rule) return true;
  const ok = rule.check(input.value);
  const wrap = input.closest(".field");
  const err = $("e" + input.id.slice(1));
  wrap.dataset.invalid = ok ? "false" : "true";
  input.setAttribute("aria-invalid", String(!ok));
  err.textContent = ok ? "" : rule.msg;
  return ok;
}

Object.keys(rules).forEach(id => {
  const input = $(id);
  input.addEventListener("blur", () => validateField(input));
  input.addEventListener("input", () => {
    if (input.closest(".field").dataset.invalid === "true") validateField(input);
  });
});

function setStatus(text, kind){
  formStatus.textContent = text;
  formStatus.className = "form-status" + (kind ? " " + kind : "");
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  let firstInvalid = null;
  Object.keys(rules).map($).forEach(f => {
    if (!validateField(f) && !firstInvalid) firstInvalid = f;
  });
  if (firstInvalid){
    firstInvalid.focus();
    setStatus("Revisa los campos marcados.", "err");
    return;
  }

  if (!FORM_ENDPOINT){
    setStatus("El formulario todavía no está conectado. Escríbenos por correo o WhatsApp mientras tanto.", "err");
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  submitBtn.disabled = true;
  submitBtn.setAttribute("aria-busy", "true");
  setStatus("Enviando…");

  try{
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    form.reset();
    Object.keys(rules).forEach(id => $(id).closest(".field").dataset.invalid = "false");
    setStatus("Mensaje enviado. Te responderemos pronto.", "ok");
  }catch(err){
    console.error(err);
    setStatus("No pudimos enviar el mensaje. Inténtalo de nuevo o escríbenos por otro canal.", "err");
  }finally{
    submitBtn.disabled = false;
    submitBtn.removeAttribute("aria-busy");
  }
});

/* ---------- Símbolo 3D con alternativa ---------- */
function mountSymbol(canvas, host, opts){
  if (!canvas || !host) return;
  const showFallback = () => host.classList.add("no-webgl");
  canvas.addEventListener("symbol-fallback", showFallback);
  try{
    if (!window.NieblaSymbol || !NieblaSymbol.init(canvas, opts)) showFallback();
  }catch(err){
    console.error(err);
    showFallback();
  }
}
function initSymbols(){
  const stage = $("stage");
  const canvas = $("heroCanvas");
  let api = null;
  if (canvas){
    stage.addEventListener("symbol-fallback", () => {});
    canvas.addEventListener("symbol-fallback", () => stage.classList.add("no-webgl"));
    try{
      api = window.NieblaSymbol && NieblaSymbol.init(canvas, { scroll: 0.0012, stage: true });
      if (!api) stage.classList.add("no-webgl");
    }catch(err){ console.error(err); stage.classList.add("no-webgl"); }
  }
  /* Marca de la cabecera y del pie: mismo símbolo 3D, pose fija. */
  document.querySelectorAll("canvas[data-mark]").forEach(c => {
    const host = c.parentElement;
    c.addEventListener("symbol-fallback", () => host.classList.add("no-webgl"));
    try{
      if (!window.NieblaSymbol || !NieblaSymbol.init(c, { zoom: 2.15, spin: false, pointer: false, angle: 0.5, tilt: 0.12 })) host.classList.add("no-webgl");
    }catch(err){ console.error(err); host.classList.add("no-webgl"); }
  });
  if (!api) return;

  /* El símbolo cambia de posición, escala y brillo según la sección visible. */
  const sections = [...document.querySelectorAll("[data-pose]")];
  let current = null, hover = null;
  function poseFor(sec){
    const p = JSON.parse(sec.dataset.pose);
    const portrait = window.innerWidth < 860;
    if (portrait){ p.x = p.x * 0.25; p.y = p.y - 0.5; p.zoom *= 0.8; p.a = Math.min(p.a, 0.5); }
    return p;
  }
  function apply(){
    if (!current) return;
    const p = poseFor(current);
    if (hover !== null) p.ry += hover * 0.55 + 0.4;
    api.pose(p);
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting){ current = e.target; apply(); } });
  }, { rootMargin: "-45% 0px -45% 0px" });
  sections.forEach(s => io.observe(s));
  current = sections[0]; apply();
  window.addEventListener("resize", apply);

  /* Responde a la acción: al recorrer un servicio, el símbolo gira. */
  document.querySelectorAll(".svc").forEach(el => {
    el.addEventListener("pointerenter", () => { hover = Number(el.dataset.i); apply(); });
    el.addEventListener("pointerleave", () => { hover = null; apply(); });
  });
}
function initProgress(){
  const bar = $("progress");
  const f = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
  };
  addEventListener("scroll", f, { passive: true }); f();
}

/* ---------- Arranque ---------- */
wireChannels();
$("year").textContent = String(new Date().getFullYear());
initSymbols();
initProgress();
})();
