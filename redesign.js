(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t, ease = t => t * t * (3 - 2 * t);
  document.documentElement.classList.add("js");

  /* menú, año y correo */
  const menu = $("#menuBtn"), nav = $("#navLinks");
  const setMenu = o => { menu.setAttribute("aria-expanded", String(o)); menu.setAttribute("aria-label", o ? "Cerrar menú" : "Abrir menú"); nav.classList.toggle("open", o); };
  menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menu.focus(); } });
  const year = $("#year"); if (year) year.textContent = new Date().getFullYear();
  const email = (window.NIEBLA_CONFIG && NIEBLA_CONFIG.contact && NIEBLA_CONFIG.contact.email) || "nieblastudiosrd@gmail.com";
  const cta = $("#emailCta"); if (cta) cta.href = "mailto:" + email + "?subject=" + encodeURIComponent("Proyecto - Niebla Studios");
  const header = $(".header"), root = document.documentElement;

  /* líneas que se dibujan al entrar */
  const rules = $$(".process-list article,.about-values div,.faq-list details,.service-list li,.team-strip,.service-columns,.service-note");
  rules.forEach(r => r.classList.add("rule"));
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .2 });
    rules.forEach(r => io.observe(r));
    const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io2.unobserve(e.target); } }), { threshold: .3 });
    $$("main h2").filter(h => !h.closest(".intro,.about")).forEach(h => { h.classList.add("focus"); io2.observe(h); });
  } else rules.forEach(r => r.classList.add("in"));

  /* titular: cada letra sale de la niebla y se ilumina donde pasas */
  const h1 = $(".hero h1"); let letters = [];
  if (h1 && !reduce) {
    h1.setAttribute("aria-label", h1.textContent.replace(/\.(?=\S)/g, ". "));
    let i = 0; const out = document.createDocumentFragment();
    h1.childNodes.forEach(n => {
      if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(t => {
        if (!t) return;
        if (/^\s+$/.test(t)) return out.appendChild(document.createTextNode(" "));
        const w = document.createElement("span"); w.className = "w"; w.setAttribute("aria-hidden", "true");
        [...t].forEach(ch => { const c = document.createElement("span"); c.className = "c"; c.style.setProperty("--i", i++); c.textContent = ch; w.appendChild(c); });
        out.appendChild(w);
      }); else out.appendChild(n.cloneNode());
    });
    h1.textContent = ""; h1.appendChild(out);
    letters = $$(".hero h1 .c").map(el => ({ el, l: .45, g: 0 }));
  }

  /* frases que se encienden palabra a palabra con el scroll */
  const lit = [];
  if (!reduce) $$(".intro h2,.about h2").forEach(el => {
    const walk = n => [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) f.appendChild(document.createTextNode(t)); else { const s = document.createElement("span"); s.className = "wd"; s.textContent = t; f.appendChild(s); } }); c.replaceWith(f); }
      else if (c.nodeType === 1 && c.tagName !== "BR") walk(c);
    });
    walk(el); const w = [...el.querySelectorAll(".wd")]; w.forEach(s => s.style.setProperty("--k", 0)); lit.push({ el, w });
  });

  /* botones magnéticos, foco de luz y inclinación */
  if (fine && !reduce) {
    $$(".button,.nav-cta").forEach(b => {
      b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.setProperty("--tx", ((e.clientX - r.left) / r.width - .5) * 14 + "px"); b.style.setProperty("--ty", ((e.clientY - r.top) / r.height - .5) * 10 + "px"); });
      b.addEventListener("pointerleave", () => { b.style.setProperty("--tx", "0px"); b.style.setProperty("--ty", "0px"); });
    });
    $$(".service-panel,.project-card").forEach(c => {
      const scr = c.querySelector(".project-screen");
      c.addEventListener("pointermove", e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        (scr || c).style.setProperty("--mx", x * 100 + "%"); (scr || c).style.setProperty("--my", y * 100 + "%");
        if (scr) { scr.style.setProperty("--ry", (x - .5) * 7 + "deg"); scr.style.setProperty("--rx", (.5 - y) * 5 + "deg"); }
      });
      c.addEventListener("pointerleave", () => { if (scr) { scr.style.setProperty("--ry", "0deg"); scr.style.setProperty("--rx", "0deg"); } });
    });
  }

  /* scroll */
  let sy = 0;
  const onScroll = () => { header.classList.toggle("scrolled", scrollY > 20); root.style.setProperty("--p", (scrollY / Math.max(1, root.scrollHeight - innerHeight)).toFixed(4)); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* niebla WebGL: un solo lienzo para toda la página */
  const cv = $("#fog");
  const gl = cv && cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) { root.classList.add("no-gl"); return; }
  const N = 20;
  const vs = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  const fs = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes,uC;uniform float uT,uY,uR,uH,uRot,uA,uD;uniform vec3 uTr[${N}];uniform sampler2D uSym;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
float sym(vec2 pa,float blur){vec2 d=pa-uC;float c=cos(uRot),s=sin(uRot);d=vec2(c*d.x+s*d.y,-s*d.x+c*d.y);
 vec2 st=vec2(d.x/(uH*.605)+.5,d.y/uH+.5);float v=0.;
 for(int i=-2;i<=2;i++)for(int j=-2;j<=2;j++){vec2 q=st+vec2(float(i),float(j))*blur;
  if(q.x>0.0 && q.x<1.0 && q.y>0.0 && q.y<1.0) v+=texture2D(uSym,q).r;}return v/25.;}
void main(){
 vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;vec2 pa=vec2(uv.x*asp,uv.y);
 vec2 pf=pa+vec2(0.,uY);
 float t=uT*.045;
 vec2 q=vec2(fbm(pf*1.7+vec2(t,0.)),fbm(pf*1.7+vec2(5.2-t,1.3)));
 float f=fbm(pf*1.9+2.4*q+vec2(t*1.4,-t));
 float dens=smoothstep(.22,.88,f);
 float clr=0.;
 for(int i=0;i<${N};i++){vec3 p=uTr[i];float d=length((uv-p.xy)*vec2(asp,1.));clr=max(clr,p.z*smoothstep(.3,.0,d));}
 dens*=1.-clr*.92;
 dens*=uD*mix(2.4,1.,uR);
 float sm=sym(pa,.004+dens*.012);
 float glow=sym(pa,.03);
 float lit=sm*(1.-min(dens,1.)*.8)*(.55+clr*.9)*uA;
 vec3 ink=vec3(.035,.043,.063),deep=vec3(.145,.388,.922),sky=vec3(.376,.647,.98);
 vec3 fog=mix(deep*.55,sky*.85,f*f);
 vec3 c=ink+fog*min(dens,1.)*.5;
 c+=sky*glow*.16*uA*(1.-clr)+sky*lit*1.15+vec3(1.)*lit*lit*.35;
 c+=deep*clr*.08;
 c+=(h(gl_FragCoord.xy+uT)-.5)/200.;
 gl_FragColor=vec4(c,1.);}`;
  const mk = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const pg = gl.createProgram(); gl.attachShader(pg, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(pg, mk(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pg);
  if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) { root.classList.add("no-gl"); return; }
  gl.useProgram(pg); gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pg, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = k => gl.getUniformLocation(pg, k);
  const u = { res: U("uRes"), c: U("uC"), t: U("uT"), y: U("uY"), r: U("uR"), h: U("uH"), rot: U("uRot"), a: U("uA"), d: U("uD"), tr: U("uTr[0]") };

  const sc = document.createElement("canvas"); sc.width = 256; sc.height = 424;
  const x = sc.getContext("2d"); x.translate(128, 212); x.scale(246.5, 246.5); x.fillStyle = "#fff";
  x.fill(new Path2D("M .435 -.055 L .3875 -.0125 .25 .0775 .195 .1 .155 .1075 .09 .1075 .0525 .1 .0125 .0825 .0075 .0775 .0125 .065 .14 -.015 .175 -.045 .1875 -.0675 .185 -.095 .18 -.105 .14 -.14 -.335 -.3925 -.3725 -.425 -.395 -.4625 -.4025 -.49 -.4025 -.8175 .21 -.47 .355 -.3825 .3875 -.3575 .42 -.325 .45 -.285 .4725 -.2375 .48 -.2075 .4775 -.135 .455 -.0825 Z M .445 .815 L -.2575 .4125 -.3075 .38 -.36 .3375 -.405 .29 -.4425 .2375 -.4625 .2 -.4775 .155 -.48 .0875 -.475 .065 -.4575 .025 -.4375 -.0025 -.41 -.0275 -.37 -.0525 -.1375 -.18 -.2 -.1375 -.2475 -.0925 -.2675 -.055 -.2675 -.0275 -.2625 -.015 -.2325 .02 -.1775 .06 .39 .3875 .415 .4125 .4325 .44 .445 .485 Z"));
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sc);
  [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(p => gl.texParameteri(gl.TEXTURE_2D, p[0], p[1]));
  gl.uniform1i(U("uSym"), 0);

  /* el símbolo viaja por la página: una pose por sección */
  const wide = () => innerWidth / innerHeight > 1;
  const POSES = [
    ["#inicio",    .72, .52, .66,  0,   1,   1],
    [".intro",     .84, .46, .52,  .5,  .3,  .35],
    ["#servicios", .5,  .5,  1.0, -.2,  .14, .3],
    ["#planes",    .88, .48, .82, -.4,  .2,  .35],
    ["#proyectos", .1,  .45, .7,  -.6,  .22, .3],
    ["#proceso",   .9,  .5,  .8,  1.2,  .24, .3],
    ["#agencia",   .55, .5,  .9,  2.0,  .2,  .4],
    ["#preguntas", .1,  .6,  .6,  2.6,  .18, .3],
    ["#contacto",  .5,  .5,  1.15, 3.14, .4, .9]
  ].map(p => ({ el: $(p[0]), x: p[1], y: p[2], h: p[3], r: p[4], a: p[5], d: p[6] })).filter(p => p.el);
  let centers = [];
  const measure = () => { centers = POSES.map(p => { const r = p.el.getBoundingClientRect(); return r.top + scrollY + r.height / 2; }); };
  const target = () => {
    const y = scrollY + innerHeight / 2; let i = 0;
    while (i < POSES.length - 1 && y >= centers[i + 1]) i++;
    const a = POSES[i], b = POSES[Math.min(i + 1, POSES.length - 1)];
    const k = a === b ? 0 : ease(clamp((y - centers[i]) / (centers[i + 1] - centers[i])));
    const w = wide(), m = k2 => lerp(a[k2], b[k2], k);
    return { x: w ? m("x") : .5, y: w ? m("y") : .56, h: m("h") * (w ? 1 : .62), r: m("r"), a: m("a") * (w ? 1 : .75), d: m("d") };
  };

  let W = 1, H = 1;
  const resize = () => {
    const k = innerWidth > 900 ? .75 : .6;
    W = cv.width = Math.max(2, Math.round(innerWidth * k)); H = cv.height = Math.max(2, Math.round(innerHeight * k));
    gl.viewport(0, 0, W, H); gl.uniform2f(u.res, W, H); measure();
  };
  addEventListener("resize", resize); addEventListener("load", measure); resize(); setTimeout(measure, 1200);

  /* rastro: el puntero despeja la niebla en toda la página */
  const trail = Array.from({ length: N }, () => ({ x: 0, y: 0, s: 0 })); let ti = 0;
  const buf = new Float32Array(N * 3);
  const drop = (px, py, s) => { const p = trail[ti++ % N]; p.x = px; p.y = py; p.s = s; };
  let lx = -1, ly = -1, lastMove = -9;
  const move = e => {
    const px = e.clientX / innerWidth, py = 1 - e.clientY / innerHeight;
    if (Math.hypot(px - lx, py - ly) > .02) { drop(px, py, 1); lx = px; ly = py; lastMove = performance.now() / 1000; }
  };
  addEventListener("pointermove", move); addEventListener("pointerdown", move);

  const P = { x: .72, y: .52, h: .66, r: 0, a: 1, d: 1 };
  const t0 = performance.now(); let prev = t0, last = 0, fr = 0;
  const draw = (T, dt) => {
    const tg = target(); const k = Math.min(1, dt * 3.2);
    for (const key in P) P[key] = lerp(P[key], tg[key], k);
    sy = lerp(sy, scrollY / innerHeight, Math.min(1, dt * 5));
    const asp = W / H;
    gl.uniform2f(u.c, P.x * asp, P.y); gl.uniform1f(u.h, P.h); gl.uniform1f(u.rot, P.r + Math.sin(T * .22) * .05);
    gl.uniform1f(u.a, P.a); gl.uniform1f(u.d, P.d); gl.uniform1f(u.y, sy * .32);
    gl.uniform3fv(u.tr, buf); gl.uniform1f(u.t, T);
    gl.uniform1f(u.r, 1 - Math.pow(1 - Math.min(1, T / 3.2), 3));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const frame = now => {
    requestAnimationFrame(frame);
    const dt = Math.min(.05, (now - prev) / 1000); prev = now; const T = (now - t0) / 1000; fr++;
    if (T - lastMove > 1.6 && T - last > .09) { last = T; drop(.5 + .42 * Math.sin(T * .35), .52 + .3 * Math.sin(T * .23 + 1), .8); }
    trail.forEach((p, i) => { p.s = Math.max(0, p.s - dt / 2.6); buf[i * 3] = p.x; buf[i * 3 + 1] = p.y; buf[i * 3 + 2] = p.s * p.s * (3 - 2 * p.s); });
    if (fr % 90 === 0) measure();
    draw(T, dt);
    /* las letras del titular reaccionan al claro de niebla */
    if (letters.length && scrollY < innerHeight) {
      const asp = innerWidth / innerHeight, kk = Math.min(1, dt * 7);
      const rects = letters.map(o => o.el.getBoundingClientRect());
      letters.forEach((o, i) => {
        const r = rects[i], ux = (r.left + r.width / 2) / innerWidth, uy = 1 - (r.top + r.height / 2) / innerHeight; let c = 0;
        for (let j = 0; j < N; j++) { const p = trail[j]; if (p.s <= 0) continue; const d = Math.hypot((ux - p.x) * asp, uy - p.y); c = Math.max(c, buf[j * 3 + 2] * clamp(1 - d / .3)); }
        o.l = lerp(o.l, .45 + .55 * c, kk); o.g = lerp(o.g, c, kk);
        o.el.style.setProperty("--l", o.l.toFixed(3)); o.el.style.setProperty("--g", o.g.toFixed(3));
      });
    }
    lit.forEach(({ el, w }) => {
      const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      const prog = clamp((innerHeight * .9 - r.top) / (innerHeight * .5)), n = w.length;
      w.forEach((s, i) => s.style.setProperty("--k", ease(clamp(prog * (n + 4) - i)).toFixed(3)));
    });
  };
  if (reduce) { buf.fill(0); const tg = target(); Object.assign(P, tg); draw(14, 1); }
  else requestAnimationFrame(frame);
})();
