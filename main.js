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
  // Keep focus on the disclosure button; the next Tab enters the opened navigation.
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
    const items = [menuToggle, ...siteNav.querySelectorAll(FOCUSABLE)].filter(el => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden" && !el.closest("[inert]"));
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
    const listItem = el.closest("li");
    if (listItem) listItem.hidden = false;
    el.removeAttribute("aria-disabled");
    el.removeAttribute("tabindex");
  } else {
    el.hidden = true;
    const listItem = el.closest("li");
    if (listItem) listItem.hidden = true;
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

  const copyButton=$("copyEmail"),copyStatus=$("copyEmailStatus");
  if(copyButton&&!copyButton.dataset.bound){
    copyButton.dataset.bound="true";
    copyButton.addEventListener("click",async()=>{
      if(!CONTACT.email)return;
      try{
        if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(CONTACT.email);
        else{
          const field=document.createElement("textarea");field.value=CONTACT.email;
          field.setAttribute("readonly","");field.style.position="fixed";field.style.opacity="0";
          document.body.append(field);field.select();
          const copied=document.execCommand("copy");field.remove();
          if(!copied)throw new Error("Clipboard unavailable");
        }
        if(copyStatus)copyStatus.textContent="Correo copiado.";
      }catch(error){
        if(copyStatus)copyStatus.textContent="No se pudo copiar. Usa el enlace de correo.";
      }
    });
  }
}

/* ---------- Símbolo 3D principal; la marca pequeña usa SVG estático ---------- */
function initSymbols(){
  const stage=$("stage"),canvas=$("heroCanvas");
  if(!stage||!canvas||getComputedStyle(stage).display==="none")return;
  const fallback=()=>stage.classList.add("no-webgl");
  canvas.addEventListener("symbol-fallback",fallback);
  try{if(!window.NieblaSymbol||!NieblaSymbol.init(canvas,{scroll:0.0012,stage:true}))fallback();}
  catch(error){console.error(error);fallback();}
}

/* ---------- Herramientas básicas de accesibilidad ---------- */
function initAccessibilityMenu(){
  const root=document.documentElement,trigger=$("accessibilityToggle"),panel=$("accessibilityPanel");
  if(!trigger||!panel)return;
  const widget=$("accessibilityWidget"),close=$("accessibilityClose"),status=$("accessibilityStatus"),sizeOutput=$("textSizeValue");
  const defaults={size:100,contrast:false,links:false,motion:false};
  const allowedSizes=[100,125,150,175,200];
  let settings={...defaults};
  try{
    const saved=JSON.parse(localStorage.getItem("niebla-a11y-settings")||"null");
    if(saved&&typeof saved==="object")settings={...defaults,...saved};
  }catch(error){}
  settings.size=allowedSizes.includes(Number(settings.size))?Number(settings.size):100;
  settings.contrast=Boolean(settings.contrast);settings.links=Boolean(settings.links);settings.motion=Boolean(settings.motion);
  function announce(message){if(status)status.textContent=message;}
  function save(){try{localStorage.setItem("niebla-a11y-settings",JSON.stringify(settings));}catch(error){announce("No se pudieron guardar los ajustes en este navegador.");}}
  function render(){
    root.style.setProperty("--a11y-text-scale",String(settings.size/100));
    root.classList.toggle("a11y-high-contrast",settings.contrast);
    root.classList.toggle("a11y-underline-links",settings.links);
    root.classList.toggle("a11y-reduced-motion",settings.motion);
    if(sizeOutput){sizeOutput.value=settings.size+"%";sizeOutput.textContent=settings.size+"%";}
    panel.querySelector('[data-a11y-action="contrast"]').setAttribute("aria-pressed",String(settings.contrast));
    panel.querySelector('[data-a11y-action="links"]').setAttribute("aria-pressed",String(settings.links));
    panel.querySelector('[data-a11y-action="motion"]').setAttribute("aria-pressed",String(settings.motion));
    panel.querySelector('[data-a11y-action="text-smaller"]').disabled=settings.size===100;
    panel.querySelector('[data-a11y-action="text-larger"]').disabled=settings.size===200;
  }
  function setOpen(open,{restoreFocus=false}={}){
    panel.hidden=!open;
    trigger.setAttribute("aria-expanded",String(open));
    trigger.setAttribute("aria-label",open?"Cerrar opciones de accesibilidad":"Abrir opciones de accesibilidad");
    if(open)close.focus();
    else if(restoreFocus)trigger.focus();
  }
  trigger.addEventListener("click",()=>setOpen(panel.hidden,{restoreFocus:!panel.hidden}));
  close.addEventListener("click",()=>setOpen(false,{restoreFocus:true}));
  panel.addEventListener("click",event=>{
    const button=event.target.closest("button[data-a11y-action]");if(!button||button.disabled)return;
    const action=button.dataset.a11yAction;
    if(action==="text-smaller")settings.size=Math.max(100,settings.size-25);
    if(action==="text-larger")settings.size=Math.min(200,settings.size+25);
    if(action==="contrast")settings.contrast=!settings.contrast;
    if(action==="links")settings.links=!settings.links;
    if(action==="motion")settings.motion=!settings.motion;
    if(action==="reset")settings={...defaults};
    save();render();
    const messages={
      "text-smaller":"Tamaño del texto: "+settings.size+" por ciento.",
      "text-larger":"Tamaño del texto: "+settings.size+" por ciento.",
      contrast:settings.contrast?"Alto contraste activado.":"Alto contraste desactivado.",
      links:settings.links?"Subrayado de enlaces activado.":"Subrayado de enlaces desactivado.",
      motion:settings.motion?"Reducción de movimiento activada.":"Reducción de movimiento desactivada.",
      reset:"Ajustes restablecidos."
    };
    announce(messages[action]);
  });
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"&&!panel.hidden){event.preventDefault();setOpen(false,{restoreFocus:true});}
  });
  document.addEventListener("pointerdown",event=>{
    if(panel.hidden||widget.contains(event.target))return;
    setOpen(false);
  });
  render();
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
  if(!title || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

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

  let frame=0, pointer=null, centers=[], heroVisible=true;
  const radius=255, maxPush=66;
  const measureLetters=()=>{
    centers=letters.map(letter=>{
      const r=letter.getBoundingClientRect();
      return {x:r.left+r.width/2,y:r.top+r.height/2};
    });
  };
  measureLetters();
  const observer="IntersectionObserver" in window?new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;if(!heroVisible)resetField();},{threshold:0}):null;
  if(observer)observer.observe(title);
  window.addEventListener("resize",measureLetters,{passive:true});
  window.addEventListener("scroll",()=>{if(heroVisible)measureLetters();},{passive:true});
  if("ResizeObserver" in window){const resizeObserver=new ResizeObserver(measureLetters);resizeObserver.observe(title);}
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(measureLetters);
  function update(){
    frame=0;
    if(!pointer||!heroVisible) return;
    letters.forEach((letter,index)=>{
      const center=centers[index];
      const dx=center.x-pointer.x;
      const dy=center.y-pointer.y;
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
    });
  }

  document.addEventListener("pointermove",e=>{
    if(e.pointerType==="touch"||!heroVisible) return;
    pointer={x:e.clientX,y:e.clientY};
    if(!frame) frame=requestAnimationFrame(update);
  },{passive:true});

  function resetField(){
    pointer=null;
    letters.forEach(letter=>{
      letter.style.setProperty("--lx","0px");
      letter.style.setProperty("--ly","0px");
      letter.style.setProperty("--lr","0deg");
    });
  }
  title.addEventListener("pointerleave",resetField);
  document.addEventListener("pointerout",event=>{if(!event.relatedTarget)resetField();});
  window.addEventListener("blur",resetField);
}
/* ---------- Arranque ---------- */
wireChannels();
const localeMeta=document.querySelector('meta[property="og:locale"]');
if(localeMeta&&window.NIEBLA_CONFIG?.site?.locale)localeMeta.content=window.NIEBLA_CONFIG.site.locale;
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
    ...document.querySelectorAll("#servicios .svc, #servicios .plan-card, #servicios .plan-service"),
    ...document.querySelectorAll("#soluciones .section-head, #soluciones .method-step"),
    ...document.querySelectorAll("#preguntas .section-head, #preguntas .method-step"),
    ...document.querySelectorAll("#proyectos .section-head, #proyectos .project"),
    ...document.querySelectorAll("#nosotros .about-grid > *"),
    ...document.querySelectorAll("#nosotros .standards-grid > *"),
    ...document.querySelectorAll("#enfoque .method-intro, #enfoque .method-step"),
    ...document.querySelectorAll("#contacto .section-head, #contacto .form, #contacto .contact-start, #contacto .contact-start-steps li"),
    ...document.querySelectorAll("#servicios .outcome-card, #enfoque .method-decision"),
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
    const originalText = heading.textContent.replace(/\s+/g, " ").trim();
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
      const parts = node.nodeValue.split(/(\s+)/);
      parts.forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
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
    const siblingIndex = el.parentElement ? [...el.parentElement.children].indexOf(el) : i;
    const stagger = Math.min(Math.max(siblingIndex, 0), 5) * 65;
    el.style.setProperty("--reveal-delay", (el.classList.contains("project") ? (i % 3) * 95 : stagger) + "ms");
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
          card.style.setProperty("--tilt-x",((.5-y)*2.2).toFixed(2)+"deg");
          card.style.setProperty("--tilt-y",((x-.5)*2.8).toFixed(2)+"deg");
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
          card.style.setProperty("--tilt-x",((.5-y)*1.5).toFixed(2)+"deg");
          card.style.setProperty("--tilt-y",((x-.5)*1.8).toFixed(2)+"deg");
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
  const desktop=window.matchMedia("(min-width: 861px) and (hover: hover) and (pointer: fine)");
  if(!desktop.matches)return;
  const main=$("main"),footer=document.querySelector(".site-footer"),header=$("siteHeader");
  if(!main||!footer)return;
  const sections=[...main.querySelectorAll(":scope > section")];
  if(!sections.length)return;
  const viewport=document.createElement("div");
  viewport.className="horizontal-viewport";
  viewport.setAttribute("role","region");
  viewport.setAttribute("aria-label","Contenido de Niebla Studios");
  const track=document.createElement("div");
  track.className="horizontal-track";
  viewport.append(track);
  const panels=[...sections,footer];
  panels.forEach(panel=>{panel.classList.add("horizontal-panel");track.append(panel);});
  main.append(viewport);
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let active=0,locked=false,lockTimer=0;
  const headerHeight=()=>header?header.getBoundingClientRect().height:0;
  document.body.classList.add("horizontal-active");
  document.documentElement.classList.add("horizontal-ready");

  function position(){track.style.transform="translate3d("+(-panels[active].offsetLeft)+"px,0,0)";}
  function update(){
    const id=panels[active].id;
    if(header)header.classList.toggle("scrolled",active>0||panels[active].scrollTop>8);
    document.querySelectorAll('.site-nav a[href^="#"]').forEach(link=>{
      if(link.getAttribute("href")==="#"+id)link.setAttribute("aria-current","location");
      else link.removeAttribute("aria-current");
    });
    const progress=$("progress");
    if(progress)progress.style.transform="scaleX("+(panels.length>1?active/(panels.length-1):0)+")";
  }
  function scrollTarget(target,panel){
    if(!target||!panel)return;
    if(target===panel){panel.scrollTo({top:0,behavior:reduce?"auto":"smooth"});return;}
    const top=target.getBoundingClientRect().top-panel.getBoundingClientRect().top+panel.scrollTop-headerHeight()-18;
    panel.scrollTo({top:Math.max(0,top),behavior:reduce?"auto":"smooth"});
  }
  function writeHash(id){
    if(id&&location.hash!=="#"+id)history.pushState({section:id},"",location.pathname+location.search+"#"+id);
  }
  function goTo(index,hashTarget=null,updateHistory=true){
    const next=clamp(index,0,panels.length-1),previous=active;
    const target=hashTarget?document.getElementById(hashTarget):null;
    if(next!==active){
      if(panels[previous].contains(document.activeElement))document.activeElement.blur();
      active=next;
      panels.forEach((panel,i)=>{panel.inert=i!==active;});
      if(!target)panels[active].scrollTop=0;
      position();update();
      locked=true;clearTimeout(lockTimer);
      lockTimer=setTimeout(()=>{locked=false;},reduce?80:650);
    }
    if(target)scrollTarget(target,panels[active]);
    else if(next===previous&&hashTarget)panels[active].scrollTo({top:0,behavior:reduce?"auto":"smooth"});
    if(updateHistory)writeHash(hashTarget||panels[active].id);
  }
  function canScroll(panel,delta,target){
    let node=target instanceof Element?target:null;
    while(node&&node!==panel){
      const style=getComputedStyle(node);
      if(["auto","scroll"].includes(style.overflowY)&&node.scrollHeight>node.clientHeight+3){
        if(delta>0&&node.scrollTop<node.scrollHeight-node.clientHeight-3)return true;
        if(delta<0&&node.scrollTop>3)return true;
      }
      node=node.parentElement;
    }
    const max=panel.scrollHeight-panel.clientHeight;
    return max>3&&(delta>0?panel.scrollTop<max-3:panel.scrollTop>3);
  }
  panels.forEach((panel,i)=>{
    panel.inert=i!==active;
    panel.addEventListener("scroll",()=>{if(i===active&&header)header.classList.toggle("scrolled",active>0||panel.scrollTop>8);},{passive:true});
  });

  let accumulated=0,direction=0,consumed=false,endTimer=0,boundaryDirection=0,boundaryAt=0;
  function resetWheel(){accumulated=0;direction=0;consumed=false;endTimer=0;}
  window.addEventListener("wheel",event=>{
    if(!desktop.matches||!document.body.classList.contains("horizontal-active")||event.ctrlKey)return;
    const delta=Math.abs(event.deltaY)>=Math.abs(event.deltaX)?event.deltaY:event.deltaX;
    if(Math.abs(delta)<4)return;
    clearTimeout(endTimer);endTimer=setTimeout(resetWheel,220);
    if(consumed){event.preventDefault();return;}
    if(locked){event.preventDefault();consumed=true;return;}
    if(canScroll(panels[active],delta,event.target)){accumulated=0;direction=0;boundaryDirection=0;boundaryAt=0;return;}
    event.preventDefault();
    const nextDirection=delta>0?1:-1;
    if(nextDirection!==direction){accumulated=0;direction=nextDirection;}
    accumulated+=Math.abs(delta);
    if(accumulated<150)return;
    consumed=true;accumulated=0;
    const now=Date.now();
    if(boundaryDirection!==nextDirection||now-boundaryAt>5000){boundaryDirection=nextDirection;boundaryAt=now;return;}
    boundaryDirection=0;boundaryAt=0;goTo(active+nextDirection);
  },{passive:false});

  document.addEventListener("click",event=>{
    const link=event.target.closest('a[href^="#"]');if(!link)return;
    const id=decodeURIComponent(link.getAttribute("href").slice(1));if(!id)return;
    const target=document.getElementById(id);if(!target)return;
    const panel=panels.find(item=>item===target||item.contains(target));
    const index=panels.indexOf(panel);if(index<0)return;
    event.preventDefault();goTo(index,id);
  });
  function syncHash(){
    const id=decodeURIComponent(location.hash.slice(1));
    if(!id){goTo(0,null,false);return;}
    const target=document.getElementById(id);
    if(!target)return;
    const panel=panels.find(item=>item===target||item.contains(target)),index=panels.indexOf(panel);
    if(index>=0)goTo(index,id,false);
  }
  addEventListener("popstate",syncHash);addEventListener("hashchange",syncHash);

  document.addEventListener("keydown",event=>{
    if(!desktop.matches||event.altKey||event.ctrlKey||event.metaKey||event.repeat)return;
    const target=event.target instanceof Element?event.target:null;
    if(target&&target.closest("a,button,summary,input,textarea,select,[contenteditable='true'],[role='button'],[role='tab']"))return;
    const panel=panels[active];
    if(event.key==="Home"||event.key==="End"){
      event.preventDefault();panel.scrollTo({top:event.key==="Home"?0:panel.scrollHeight,behavior:reduce?"auto":"smooth"});return;
    }
    let dir=0;
    if(["ArrowDown","PageDown"].includes(event.key)||(event.key===" "&&!event.shiftKey))dir=1;
    if(["ArrowUp","PageUp"].includes(event.key)||(event.key===" "&&event.shiftKey))dir=-1;
    if(!dir||canScroll(panel,dir,target))return;
    event.preventDefault();if(!locked)goTo(active+dir);
  });

  const initialId=decodeURIComponent(location.hash.slice(1)),initialTarget=initialId&&document.getElementById(initialId);
  const initialPanel=initialTarget&&panels.find(panel=>panel===initialTarget||panel.contains(initialTarget));
  if(initialPanel)active=panels.indexOf(initialPanel);
  panels.forEach((panel,i)=>{panel.inert=i!==active;});
  position();update();
  if(initialTarget&&initialTarget!==initialPanel)requestAnimationFrame(()=>scrollTarget(initialTarget,initialPanel));
  const resize=()=>requestAnimationFrame(position);
  addEventListener("resize",resize,{passive:true});
  if(visualViewport)visualViewport.addEventListener("resize",resize,{passive:true});
  desktop.addEventListener("change",event=>{
    if(event.matches)return;
    const activePanel=panels[active],scrollTop=activePanel.scrollTop;
    panels.forEach(panel=>{panel.inert=false;panel.classList.remove("horizontal-panel");});
    main.append(...sections);viewport.remove();main.after(footer);
    document.body.classList.remove("horizontal-active");document.documentElement.classList.remove("horizontal-ready");
    requestAnimationFrame(()=>{const top=activePanel.getBoundingClientRect().top+scrollY;scrollTo(0,top+scrollTop);});
  });
}

/* ---------- Navegación horizontal táctil (móviles) ---------- */
function initMobileSectionSwipe(){
  const mobile=matchMedia("(max-width: 860px) and (pointer: coarse)");
  if(!mobile.matches)return;
  const main=$("main"),footer=document.querySelector(".site-footer"),header=$("siteHeader");
  if(!main||!footer)return;
  const sections=[...main.querySelectorAll(":scope > section")];if(!sections.length)return;
  const panels=[...sections,footer],reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const viewport=document.createElement("div");viewport.className="mobile-horizontal-viewport";
  viewport.setAttribute("role","region");viewport.setAttribute("aria-label","Contenido de Niebla Studios");
  const track=document.createElement("div");track.className="mobile-horizontal-track";viewport.append(track);
  panels.forEach(panel=>{panel.classList.add("mobile-horizontal-panel");track.append(panel);});main.append(viewport);
  let active=0;
  const cue=document.createElement("div");cue.className="mobile-swipe-cue";
  cue.innerHTML='<span class="mobile-swipe-cue-label">Desliza para explorar</span><span class="mobile-swipe-cue-arrows" aria-hidden="true">← <i></i> →</span>';
  cue.setAttribute("aria-hidden","false");panels[0].append(cue);
  let cueDismissed=false;
  function dismissCue(){if(cueDismissed)return;cueDismissed=true;cue.classList.add("is-dismissed");cue.setAttribute("aria-hidden","true");}
  const headerHeight=()=>header?header.getBoundingClientRect().height:0;
  document.documentElement.classList.add("mobile-horizontal-ready");document.body.classList.add("mobile-horizontal-active");
  function position(){track.style.transform="translate3d("+(-active*viewport.clientWidth)+"px,0,0)";}
  function update(){
    const id=panels[active].id;
    if(header)header.classList.toggle("scrolled",active>0||panels[active].scrollTop>8);
    document.querySelectorAll('.site-nav a[href^="#"]').forEach(link=>{
      if(link.getAttribute("href")==="#"+id)link.setAttribute("aria-current","location");else link.removeAttribute("aria-current");
    });
    const progress=$("progress");if(progress)progress.style.transform="scaleX("+(panels.length>1?active/(panels.length-1):0)+")";
  }
  function scrollTarget(target,panel){
    if(!target||!panel)return;
    if(target===panel){panel.scrollTo({top:0,behavior:reduce?"auto":"smooth"});return;}
    const top=target.getBoundingClientRect().top-panel.getBoundingClientRect().top+panel.scrollTop-headerHeight()-18;
    panel.scrollTo({top:Math.max(0,top),behavior:reduce?"auto":"smooth"});
  }
  function goTo(index,id=null,updateHistory=true){
    const next=clamp(index,0,panels.length-1),previous=active,target=id&&document.getElementById(id);
    if(next!==active){
      if(panels[previous].contains(document.activeElement))document.activeElement.blur();
      active=next;panels.forEach((panel,i)=>{panel.inert=i!==active;});
      if(active>0)dismissCue();if(!target)panels[active].scrollTop=0;
      position();update();
    }
    if(target)scrollTarget(target,panels[active]);
    else if(next===previous&&id)panels[active].scrollTo({top:0,behavior:reduce?"auto":"smooth"});
    const hash=id||panels[active].id;
    if(updateHistory&&hash&&location.hash!=="#"+hash)history.pushState({section:hash},"",location.pathname+location.search+"#"+hash);
  }
  panels.forEach((panel,i)=>{
    panel.inert=i!==active;
    panel.addEventListener("scroll",()=>{if(i===active&&header)header.classList.toggle("scrolled",active>0||panel.scrollTop>8);},{passive:true});
  });
  function syncHash(){
    const id=decodeURIComponent(location.hash.slice(1));
    if(!id){goTo(0,null,false);return;}
    const target=document.getElementById(id);
    if(!target)return;
    const panel=panels.find(item=>item===target||item.contains(target)),index=panels.indexOf(panel);
    if(index>=0)goTo(index,id,false);
  }
  addEventListener("popstate",syncHash);addEventListener("hashchange",syncHash);
  document.addEventListener("click",event=>{
    const link=event.target.closest('a[href^="#"]');if(!link)return;
    const id=decodeURIComponent(link.getAttribute("href").slice(1));if(!id)return;
    const target=document.getElementById(id);if(!target)return;
    const panel=panels.find(item=>item===target||item.contains(target)),index=panels.indexOf(panel);
    if(index<0)return;event.preventDefault();goTo(index,id);
    if(isMobileMenuOpen())setMenu(false);
  });
  let start=null;
  document.addEventListener("touchstart",event=>{
    if(!mobile.matches||event.touches.length!==1||isMobileMenuOpen()){start=null;return;}
    const target=event.target;
    if(target.closest("a,button,input,textarea,select,[contenteditable='true'],[data-no-section-swipe],.project-carousel,.demo-carousel,[data-horizontal-scroll]")){start=null;return;}
    const panel=target.closest(".mobile-horizontal-panel");if(!panel||panels[active]!==panel){start=null;return;}
    const touch=event.touches[0];start={x:touch.clientX,y:touch.clientY};
  },{passive:true});
  document.addEventListener("touchend",event=>{
    if(!start||!mobile.matches||!event.changedTouches.length)return;
    const origin=start;start=null;const touch=event.changedTouches[0];
    const dx=touch.clientX-origin.x,dy=touch.clientY-origin.y;
    if(Math.abs(dx)<56||Math.abs(dx)<Math.abs(dy)*1.25)return;
    if(dx<0&&active<panels.length-1)goTo(active+1);else if(dx>0&&active>0)goTo(active-1);
  },{passive:true});
  document.addEventListener("touchcancel",()=>{start=null;},{passive:true});
  const resize=()=>requestAnimationFrame(position);addEventListener("resize",resize,{passive:true});
  if(visualViewport)visualViewport.addEventListener("resize",resize,{passive:true});
  document.addEventListener("keydown",event=>{
    if(!mobile.matches||event.altKey||event.ctrlKey||event.metaKey||event.repeat)return;
    const target=event.target instanceof Element?event.target:null;
    if(target&&target.closest("a,button,summary,input,textarea,select,[contenteditable='true']"))return;
    if(event.key==="ArrowRight"&&active<panels.length-1){event.preventDefault();goTo(active+1);}
    if(event.key==="ArrowLeft"&&active>0){event.preventDefault();goTo(active-1);}
  });
  const initialId=decodeURIComponent(location.hash.slice(1)),initialTarget=initialId&&document.getElementById(initialId);
  const initialPanel=initialTarget&&panels.find(panel=>panel===initialTarget||panel.contains(initialTarget));
  if(initialPanel)active=panels.indexOf(initialPanel);
  panels.forEach((panel,i)=>{panel.inert=i!==active;});position();update();
  if(initialTarget&&initialTarget!==initialPanel)requestAnimationFrame(()=>scrollTarget(initialTarget,initialPanel));
}

initAccessibilityMenu();
initMotion();
initHorizontalNavigation();
initMobileSectionSwipe();
})();