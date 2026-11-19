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
  if (!stage || !canvas) return;

  /* El símbolo 3D vive únicamente dentro del hero. */
  const host = stage;
  canvas.addEventListener("symbol-fallback", () => host.classList.add("no-webgl"));
  try{
    if (!window.NieblaSymbol || !NieblaSymbol.init(canvas, { scroll: 0.0012, stage: true })) {
      host.classList.add("no-webgl");
    }
  }catch(err){
    console.error(err);
    host.classList.add("no-webgl");
  }

  /* Los pequeños símbolos de marca de la cabecera/pie permanecen estáticos. */
  document.querySelectorAll("canvas[data-mark]").forEach(c => {
    const markHost = c.parentElement;
    c.addEventListener("symbol-fallback", () => markHost.classList.add("no-webgl"));
    try{
      if (!window.NieblaSymbol || !NieblaSymbol.init(c, { zoom: 2.15, spin: false, pointer: false, angle: 0.5, tilt: 0.12 })) markHost.classList.add("no-webgl");
    }catch(err){ console.error(err); markHost.classList.add("no-webgl"); }
  });
}
function initProgress(){
  const bar = $("progress");
  const f = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? clamp(scrollY / max, 0, 1) : 0) + ")";
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
  const radius=255, maxPush=66;
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
      const swirl=push*.82;
      letter.style.setProperty("--lx",(nx*push-ny*swirl).toFixed(2)+"px");
      letter.style.setProperty("--ly",(ny*push+nx*swirl).toFixed(2)+"px");
      letter.style.setProperty("--lr",(nx*ny*influence*26).toFixed(2)+"deg");
    }
  }

  document.addEventListener("pointermove",e=>{
    if(e.pointerType==="touch") return;
    pointer={x:e.clientX,y:e.clientY};
    if(!frame) frame=requestAnimationFrame(update);
  },{passive:true});

  const resetField=()=>{
    pointer=null;
    letters.forEach(letter=>{
      letter.style.setProperty("--lx","0px");
      letter.style.setProperty("--ly","0px");
      letter.style.setProperty("--lr","0deg");
    });
  };
  window.addEventListener("pointerleave",resetField);
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
    ...document.querySelectorAll("#soluciones .section-head, #soluciones .method-step"),
    ...document.querySelectorAll("#preguntas .section-head, #preguntas .method-step"),
    ...document.querySelectorAll("#proyectos .section-head, #proyectos .project"),
    ...document.querySelectorAll("#nosotros .about-grid > *"),
    ...document.querySelectorAll("#enfoque .method-intro, #enfoque .method-step"),
    ...document.querySelectorAll("#contacto .section-head, #contacto .form, #contacto .contact-start"),
    ...document.querySelectorAll("#servicios .outcome-card, #enfoque .deliverable-grid article"),
    ...document.querySelectorAll("#proyectos .demo-boundary, #nosotros .studio-direction, #nosotros .studio-principles article, #nosotros .standards"),
    ...document.querySelectorAll(".footer-grid > *")
  ];
  /* Tipografía cinética: los títulos entran palabra por palabra al aparecer. */
  const kineticHeadings = [...document.querySelectorAll(
    "main h2, main h3, main h4, .site-footer .footer-title"
  )].filter(el => el.id !== "heroTitle" && !el.closest(".project-media"));

  const kineticObserver = !reduce && "IntersectionObserver" in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("kinetic-visible");
          kineticObserver.unobserve(entry.target);
        });
      }, { threshold: .35, rootMargin: "0px 0px -5% 0px" })
    : null;

  kineticHeadings.forEach(heading => {
    const originalText = heading.textContent.replace(/\\s+/g, " ").trim();
    if (!originalText) return;
    heading.setAttribute("aria-label", originalText);
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.trim()) textNodes.push(walker.currentNode);
    }
    let wordIndex = 0;
    textNodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      const parts = node.nodeValue.split(/(\\s+)/);
      parts.forEach(part => {
        if (!part) return;
        if (/^\\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          return;
        }
        const clip = document.createElement("span");
        const word = document.createElement("span");
        clip.className = "kinetic-word-clip";
        word.className = "kinetic-word";
        clip.setAttribute("aria-hidden", "true");
        word.textContent = part;
        word.style.setProperty("--word-index", wordIndex++);
        clip.append(word);
        fragment.append(clip);
      });
      node.parentNode.replaceChild(fragment, node);
    });
    heading.classList.add("kinetic-heading");
    if (reduce || !kineticObserver) heading.classList.add("kinetic-visible");
    else kineticObserver.observe(heading);
  });

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
  const observedSections=[...new Set(navLinks.map(a=>document.querySelector(a.getAttribute("href"))).filter(Boolean))];
  const desktopHorizontal=window.matchMedia("(min-width: 861px) and (hover: hover) and (pointer: fine)");
  const setActiveSection=()=>{
    if(desktopHorizontal.matches)return;
    const anchor=window.innerHeight*.45;
    const containing=observedSections.filter(section=>{
      const rect=section.getBoundingClientRect();
      return rect.top<=anchor && rect.bottom>anchor;
    });
    const current=containing.sort((a,b)=>
      Math.abs(a.getBoundingClientRect().top-anchor)-Math.abs(b.getBoundingClientRect().top-anchor)
    )[0] || null;

    // Si no hay una sección enlazada en el punto de lectura (hero/footer),
    // se limpia el estado anterior en vez de dejar una categoría obsoleta activa.
    navLinks.forEach(link=>{
      if(current && link.getAttribute("href")==="#"+current.id) link.setAttribute("aria-current","location");
      else link.removeAttribute("aria-current");
    });
  };
  let navFrame=0;
  const scheduleActiveSection=()=>{
    if(desktopHorizontal.matches || navFrame)return;
    navFrame=requestAnimationFrame(()=>{
      navFrame=0;
      setActiveSection();
    });
  };
  if("IntersectionObserver" in window){
    const navObserver=new IntersectionObserver(scheduleActiveSection,{rootMargin:"-35% 0px -55% 0px",threshold:0});
    observedSections.forEach(section=>navObserver.observe(section));
  }
  // El cálculo también escucha scroll/resize: IntersectionObserver puede no emitir
  // otra entrada mientras el punto de lectura se mueve dentro de una sección alta.
  window.addEventListener("scroll",scheduleActiveSection,{passive:true});
  window.addEventListener("resize",scheduleActiveSection,{passive:true});
  desktopHorizontal.addEventListener("change",scheduleActiveSection);
  scheduleActiveSection();
  document.documentElement.classList.add("motion-ready");
}


/* ---------- Navegación horizontal por secciones (escritorio) ---------- */
function initHorizontalNavigation(){
  const desktop = window.matchMedia("(min-width: 861px) and (hover: hover) and (pointer: fine)");
  if(!desktop.matches) return;

  const main = $("main");
  const footer = document.querySelector(".site-footer");
  if(!main || !footer) return;

  const sections = [...main.querySelectorAll(":scope > section")];
  if(!sections.length) return;

  const viewport = document.createElement("div");
  viewport.className = "horizontal-viewport";
  viewport.setAttribute("aria-label","Contenido de Niebla Studios");
  const track = document.createElement("div");
  track.className = "horizontal-track";
  viewport.append(track);
  sections.forEach(section => {
    section.classList.add("horizontal-panel");
    section.addEventListener("scroll", () => {
      if(header && panels[active] === section) header.classList.toggle("scrolled", active > 0 || section.scrollTop > 8);
    }, {passive:true});
    track.append(section);
  });
  footer.classList.add("horizontal-panel");
  track.append(footer);
  main.append(viewport);

  const panels = [...track.children];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let active = 0;
  let locked = false;
  let lockTimer = 0;

  document.body.classList.add("horizontal-active");
  document.documentElement.classList.add("horizontal-ready");

  function updateNavigation(){
    const currentId = panels[active].id;
    if(header) header.classList.toggle("scrolled", active > 0 || panels[active].scrollTop > 8);
    document.querySelectorAll('.site-nav a[href^="#"]').forEach(link => {
      if(link.getAttribute("href") === "#" + currentId) link.setAttribute("aria-current","location");
      else link.removeAttribute("aria-current");
    });
    const progress = $("progress");
    if(progress) progress.style.transform = "scaleX(" + (panels.length > 1 ? active/(panels.length-1) : 0) + ")";
  }

  function goTo(index, updateHash=true){
    const next = clamp(index,0,panels.length-1);
    if(next === active) return;
    active = next;
    panels[active].scrollTop = 0;
    track.style.transform = "translate3d(" + (-panels[active].offsetLeft) + "px,0,0)";
    updateNavigation();
    if(updateHash && panels[active].id){
      history.replaceState(null,"","#"+panels[active].id);
    }
    locked = true;
    window.clearTimeout(lockTimer);
    lockTimer = window.setTimeout(()=>{locked=false;}, reduceMotion ? 80 : 850);
  }

  function canScrollInside(panel, delta){
    const max = panel.scrollHeight - panel.clientHeight;
    if(max <= 3) return false;
    if(delta > 0) return panel.scrollTop < max - 3;
    return panel.scrollTop > 3;
  }

  /* Una secuencia física de rueda/touchpad solo puede cambiar una sección.
     La inercia posterior al primer cambio se descarta hasta que el gesto termina. */
  let wheelAccumulated = 0;
  let wheelDirection = 0;
  let wheelGestureConsumed = false;
  let wheelEndTimer = 0;
  const wheelThreshold = 150;
  const wheelGestureEndDelay = 220;

  function resetWheelGesture(){
    wheelAccumulated = 0;
    wheelDirection = 0;
    wheelGestureConsumed = false;
    wheelEndTimer = 0;
  }

  window.addEventListener("wheel", event => {
    if(!desktop.matches || !document.body.classList.contains("horizontal-active")) return;
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if(Math.abs(delta) < 4) return;

    window.clearTimeout(wheelEndTimer);
    wheelEndTimer = window.setTimeout(resetWheelGesture,wheelGestureEndDelay);

    if(wheelGestureConsumed) {
      event.preventDefault();
      return;
    }

    if(locked) {
      event.preventDefault();
      wheelGestureConsumed = true;
      return;
    }

    const panel = panels[active];
    if(canScrollInside(panel,delta)) {
      wheelAccumulated = 0;
      wheelDirection = 0;
      return;
    }

    event.preventDefault();
    const direction = delta > 0 ? 1 : -1;
    if(direction !== wheelDirection) {
      wheelAccumulated = 0;
      wheelDirection = direction;
    }
    wheelAccumulated += Math.abs(delta);

    if(wheelAccumulated < wheelThreshold) return;

    wheelGestureConsumed = true;
    wheelAccumulated = 0;
    goTo(active + direction);
  },{passive:false});

  document.addEventListener("click",event=>{
    if(!desktop.matches)return;
    const link=event.target.closest('a[href^="#"]');
    if(!link) return;
    const id=decodeURIComponent(link.getAttribute("href").slice(1));
    if(!id) return;
    const target=document.getElementById(id);
    if(!target) return;
    const panel=target.classList.contains("horizontal-panel") ? target : target.closest(".horizontal-panel");
    const index=panels.indexOf(panel);
    if(index < 0) return;
    event.preventDefault();
    goTo(index);
  });

  document.addEventListener("keydown",event=>{
    if(!desktop.matches || !document.body.classList.contains("horizontal-active") || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    const tag=event.target && event.target.tagName;
    if(["INPUT","TEXTAREA","SELECT"].includes(tag) || event.target.isContentEditable) return;
    let direction=0;
    if(["ArrowDown","PageDown"].includes(event.key) || (event.key===" " && !event.shiftKey)) direction=1;
    if(["ArrowUp","PageUp"].includes(event.key) || (event.key===" " && event.shiftKey)) direction=-1;
    if(event.key==="Home") direction=-active;
    if(event.key==="End") direction=panels.length-1-active;
    if(!direction) return;
    event.preventDefault();
    if(locked) return;
    goTo(active+direction);
  });

  const initialId=decodeURIComponent(location.hash.slice(1));
  const initialTarget=initialId && document.getElementById(initialId);
  const initialPanel=initialTarget && (initialTarget.classList.contains("horizontal-panel") ? initialTarget : initialTarget.closest(".horizontal-panel"));
  if(initialPanel && panels.includes(initialPanel)) active=panels.indexOf(initialPanel);
  track.style.transform="translate3d("+(-panels[active].offsetLeft)+"px,0,0)";
  updateNavigation();

  // Si el usuario reduce la ventana hasta el breakpoint móvil, devuelve las
  // secciones al flujo vertical y restaura el footer fuera del viewport horizontal.
  desktop.addEventListener("change",event=>{
    if(event.matches)return;
    const activePanel=panels[active];
    const panelScrollTop=activePanel.scrollTop;
    main.append(...sections);
    viewport.remove();
    main.after(footer);
    sections.forEach(section=>section.classList.remove("horizontal-panel"));
    footer.classList.remove("horizontal-panel");
    document.body.classList.remove("horizontal-active");
    document.documentElement.classList.remove("horizontal-ready");
    // Conserva la sección y el desplazamiento interno al volver al flujo vertical.
    requestAnimationFrame(()=>{
      const top=activePanel.getBoundingClientRect().top+window.scrollY;
      window.scrollTo(0,top+panelScrollTop);
    });
  });
}

initMotion();
initHorizontalNavigation();
})();