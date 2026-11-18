/* Niebla Studios — comportamiento de la web.
   Los datos de contacto y configuración se toman de ./config.js (window.NIEBLA_CONFIG). */
(function(){
"use strict";

const CONFIG = window.NIEBLA_CONFIG || {};
const CONTACT = CONFIG.contact || {};


const $ = id => document.getElementById(id);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const header = $("siteHeader");
const menuToggle = $("menuToggle");
const siteNav = $("siteNav");

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
function setChannel(el, href){
  if (!el) return;
  if (href){
    el.href = href;
    el.hidden = false;
    el.removeAttribute("aria-disabled");
    el.removeAttribute("tabindex");
  } else {
    el.hidden = true;
    el.removeAttribute("href");
    el.setAttribute("aria-disabled", "true");
    el.setAttribute("tabindex", "-1");
  }
}

function wireChannels(){
  const digits = String(CONTACT.whatsapp || "").replace(/\D/g, "");
  const waHref = digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(CONTACT.whatsappMessage || "")}`
    : "";
  const mailHref = CONTACT.email ? `mailto:${CONTACT.email}` : "";

  setChannel($("whatsappLink"), waHref);
  setChannel($("footerWhatsapp"), waHref);
  setChannel($("emailLink"), mailHref);
  setChannel($("footerEmail"), mailHref);
}

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
    if (portrait){ p.x = 1.25; p.y = -0.55; p.zoom *= 0.62; p.a = Math.min(p.a, 0.16); }
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


/* ---------- Campo interactivo de letras: prototipo solo en el hero ---------- */
function initHeroLetterField(){
  const title=$("heroTitle");
  if(!title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const walker=document.createTreeWalker(title,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode()) if(walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
  nodes.forEach(node=>{
    const fragment=document.createDocumentFragment();
    for(const char of node.nodeValue){
      if(/\s/.test(char)){ fragment.append(document.createTextNode(char)); continue; }
      const letter=document.createElement("span");
      letter.className="hero-letter";
      letter.setAttribute("aria-hidden","true");
      letter.textContent=char;
      fragment.append(letter);
    }
    node.parentNode.replaceChild(fragment,node);
  });

  const letters=[...title.querySelectorAll(".hero-letter")];
  if(!letters.length) return;
  title.classList.add("has-letter-field");

  let frame=0, pointer=null;
  const radius=190, maxPush=34;
  function update(){
    frame=0;
    if(!pointer) return;
    for(const letter of letters){
      const r=letter.getBoundingClientRect();
      const dx=r.left+r.width/2-pointer.x;
      const dy=r.top+r.height/2-pointer.y;
      const distance=Math.hypot(dx,dy);
      const influence=Math.max(0,1-distance/radius);
      const force=influence*influence;
      const nx=distance?dx/distance:0;
      const ny=distance?dy/distance:-1;
      const push=maxPush*force;
      const swirl=push*.28;
      letter.style.setProperty("--lx",(nx*push-ny*swirl).toFixed(2)+"px");
      letter.style.setProperty("--ly",(ny*push+nx*swirl).toFixed(2)+"px");
      letter.style.setProperty("--lr",(nx*ny*influence*12).toFixed(2)+"deg");
    }
  }

  window.addEventListener("pointermove",e=>{
    if(e.pointerType==="touch") return;
    pointer={x:e.clientX,y:e.clientY};
    if(!frame) frame=requestAnimationFrame(update);
  },{passive:true});

  window.addEventListener("blur",()=>{
    pointer=null;
    letters.forEach(letter=>{
      letter.style.setProperty("--lx","0px");
      letter.style.setProperty("--ly","0px");
      letter.style.setProperty("--lr","0deg");
    });
  });
}
/* ---------- Arranque ---------- */
wireChannels();
$("year").textContent = String(new Date().getFullYear());
initSymbols();
initProgress();
initHeroLetterField();

/* ---------- Sistema de movimiento inmersivo ---------- */
function initMotion(){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const revealTargets = [
    ...document.querySelectorAll("#servicios .section-head, #servicios .service-group"),
    ...document.querySelectorAll("#proyectos .section-head, #proyectos .project"),
    ...document.querySelectorAll("#nosotros .about-grid > *"),
    ...document.querySelectorAll("#proceso .section-head, #proceso .step"),
    ...document.querySelectorAll("#contacto .section-head, #contacto .form"),
    ...document.querySelectorAll(".footer-grid > *")
  ];
  revealTargets.forEach((el,i) => {
    el.dataset.reveal = el.classList.contains("project") && i % 2 ? "right" : "up";
    el.style.setProperty("--reveal-delay", (el.classList.contains("step") ? (i % 4) * 110 : el.classList.contains("project") ? (i % 3) * 120 : 50) + "ms");
  });

  if (reduce){
    revealTargets.forEach(el => el.classList.add("is-visible"));
  }else if ("IntersectionObserver" in window){
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },{threshold:.12,rootMargin:"0px 0px -7% 0px"});
    revealTargets.forEach(el => revealObserver.observe(el));
  }else{
    revealTargets.forEach(el => el.classList.add("is-visible"));
  }

  document.querySelectorAll(".svc").forEach(card => {
    card.addEventListener("pointermove",e => {
      const r=card.getBoundingClientRect();
      card.style.setProperty("--mx",(e.clientX-r.left)+"px");
      card.style.setProperty("--my",(e.clientY-r.top)+"px");
    },{passive:true});
  });

  if(!reduce){
    document.querySelectorAll(".project").forEach(card => {
      const media=card.querySelector(".project-media");
      const reset=()=>{
        card.style.setProperty("--tilt-x","0deg");
        card.style.setProperty("--tilt-y","0deg");
        card.style.setProperty("--mx","50%");
        card.style.setProperty("--my","50%");
        card.classList.remove("is-touch-active");
      };
      const moveHighlight=(x,y)=>{
        card.style.setProperty("--mx",(x*100)+"%");
        card.style.setProperty("--my",(y*100)+"%");
        if(media){
          media.style.setProperty("--mx",(x*100)+"%");
          media.style.setProperty("--my",(y*100)+"%");
        }
      };

      if(finePointer){
        card.addEventListener("pointermove",e=>{
          if(e.pointerType!=="mouse") return;
          const r=card.getBoundingClientRect();
          const x=clamp((e.clientX-r.left)/r.width,0,1);
          const y=clamp((e.clientY-r.top)/r.height,0,1);
          card.style.setProperty("--tilt-x",((.5-y)*5).toFixed(2)+"deg");
          card.style.setProperty("--tilt-y",((x-.5)*6).toFixed(2)+"deg");
          moveHighlight(x,y);
        },{passive:true});
        card.addEventListener("pointerleave",reset);
      }else{
        card.addEventListener("pointerdown",e=>{
          if(e.pointerType!=="touch") return;
          const r=card.getBoundingClientRect();
          const x=clamp((e.clientX-r.left)/r.width,0,1);
          const y=clamp((e.clientY-r.top)/r.height,0,1);
          card.classList.add("is-touch-active");
          card.style.setProperty("--tilt-x",((.5-y)*2.8).toFixed(2)+"deg");
          card.style.setProperty("--tilt-y",((x-.5)*3.4).toFixed(2)+"deg");
          moveHighlight(x,y);
        },{passive:true});
        card.addEventListener("pointerup",reset,{passive:true});
        card.addEventListener("pointercancel",reset,{passive:true});
      }
    });
  }

  const navLinks=[...document.querySelectorAll('.site-nav a[href^="#"]')];
  const observedSections=navLinks.map(a=>document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if("IntersectionObserver" in window){
    const navObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        navLinks.forEach(a=>{
          if(a.getAttribute("href")==="#"+entry.target.id) a.setAttribute("aria-current","location");
          else a.removeAttribute("aria-current");
        });
      });
    },{rootMargin:"-42% 0px -48% 0px",threshold:0});
    observedSections.forEach(section=>navObserver.observe(section));
  }
  document.documentElement.classList.add("motion-ready");
}

initMotion();
})();