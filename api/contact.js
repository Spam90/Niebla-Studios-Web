const CONTACT_RECIPIENT = "nieblastudiosrd@gmail.com";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map();

function respond(res, status, body) {
  return res.status(status).json(body);
}
function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[char]);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return respond(res, 405, { ok: false, error: "Método no permitido." });
  }
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); }
    catch { return respond(res, 400, { ok: false, error: "Solicitud no válida." }); }
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return respond(res, 400, { ok: false, error: "Solicitud no válida." });
  }
  if (clean(body.company, 200)) return respond(res, 200, { ok: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 254).toLowerCase();
  const service = clean(body.service, 100);
  const message = clean(body.message, 2000);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!name || !emailPattern.test(email) || !service || message.length < 10) {
    return respond(res, 400, { ok: false, error: "Revisa el nombre, el correo, el servicio y el mensaje." });
  }

  const now = Date.now();
  const forwarded = clean(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown", 120);
  const ip = forwarded.split(",")[0].trim();
  const recent = (attempts.get(ip) || []).filter(time => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    res.setHeader("Retry-After", String(Math.ceil((WINDOW_MS - (now - recent[0])) / 1000)));
    return respond(res, 429, { ok: false, error: "Demasiadas solicitudes. Inténtalo más tarde." });
  }
  recent.push(now);
  attempts.set(ip, recent);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) return respond(res, 503, { ok: false, error: "El formulario todavía no está configurado." });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeService = escapeHtml(service);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");
  const payload = {
    from,
    to: [CONTACT_RECIPIENT],
    reply_to: email,
    subject: "Nueva consulta web — Niebla Studios",
    text: ["Nueva consulta desde nieblastudio.devs.surf","Nombre: " + name,"Correo: " + email,"Servicio: " + service,"",message].join("\n"),
    html: "<h2>Nueva consulta desde la web de Niebla Studios</h2>" +
      "<p><strong>Nombre:</strong> " + safeName + "</p>" +
      "<p><strong>Correo:</strong> " + safeEmail + "</p>" +
      "<p><strong>Servicio:</strong> " + safeService + "</p>" +
      "<p><strong>Mensaje:</strong><br>" + safeMessage + "</p>"
  };
  try {
    const upstream = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!upstream.ok) return respond(res, 502, { ok: false, error: "El servicio de correo no pudo aceptar el mensaje. Inténtalo más tarde." });
    return respond(res, 200, { ok: true });
  } catch {
    return respond(res, 502, { ok: false, error: "No se pudo conectar con el servicio de correo. Inténtalo más tarde." });
  }
};
