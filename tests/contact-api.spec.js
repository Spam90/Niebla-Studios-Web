const { test, expect } = require("@playwright/test");
const handler = require("../api/contact");
function mockResponse() {
  return { statusCode: 200, headers: {}, body: null,
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name] = value; },
    json(body) { this.body = body; return this; } };
}
test("contact API rejects methods other than POST", async () => {
  const res = mockResponse();
  await handler({ method: "GET", headers: {} }, res);
  expect(res.statusCode).toBe(405);
  expect(res.headers.Allow).toBe("POST");
});
test("contact API validates required fields before sending", async () => {
  const res = mockResponse();
  await handler({ method: "POST", headers: {}, body: { name: "Test" } }, res);
  expect(res.statusCode).toBe(400);
});
test("contact API silently accepts honeypot submissions without sending email", async () => {
  const originalFetch = global.fetch;
  let called = false;
  global.fetch = async () => { called = true; return { ok: true }; };
  try {
    const res = mockResponse();
    await handler({ method: "POST", headers: {}, body: { company: "bot", name: "Bot", email: "bot@example.com", service: "Web", message: "A sufficiently long message" } }, res);
    expect(res.statusCode).toBe(200);
    expect(called).toBe(false);
  } finally { global.fetch = originalFetch; }
});
test("contact API reports missing Resend configuration without exposing secrets", async () => {
  const oldKey = process.env.RESEND_API_KEY, oldFrom = process.env.CONTACT_FROM_EMAIL;
  delete process.env.RESEND_API_KEY; delete process.env.CONTACT_FROM_EMAIL;
  try {
    const res = mockResponse();
    await handler({ method: "POST", headers: {}, body: { name: "Test", email: "test@example.com", service: "Web", message: "Necesito una página para mi negocio." } }, res);
    expect(res.statusCode).toBe(503);
    expect(JSON.stringify(res.body)).not.toContain("RESEND_API_KEY");
  } finally {
    if (oldKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = oldKey;
    if (oldFrom === undefined) delete process.env.CONTACT_FROM_EMAIL; else process.env.CONTACT_FROM_EMAIL = oldFrom;
  }
});
test("contact API sends validated requests through Resend and sets reply-to", async () => {
  const oldKey = process.env.RESEND_API_KEY, oldFrom = process.env.CONTACT_FROM_EMAIL, originalFetch = global.fetch;
  process.env.RESEND_API_KEY = "test-key"; process.env.CONTACT_FROM_EMAIL = "web@example.com";
  let sent;
  global.fetch = async (url, options) => { sent = { url, options }; return { ok: true }; };
  try {
    const res = mockResponse();
    await handler({ method: "POST", headers: {}, body: { name: "Cliente", email: "cliente@example.com", service: "Catálogo digital", message: "Quiero organizar los productos de mi negocio." } }, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(sent.url).toBe("https://api.resend.com/emails");
    expect(sent.options.headers.Authorization).toBe("Bearer test-key");
    const payload = JSON.parse(sent.options.body);
    expect(payload.to).toEqual(["nieblastudiosrd@gmail.com"]);
    expect(payload.reply_to).toBe("cliente@example.com");
    expect(payload.from).toBe("web@example.com");
  } finally {
    global.fetch = originalFetch;
    if (oldKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = oldKey;
    if (oldFrom === undefined) delete process.env.CONTACT_FROM_EMAIL; else process.env.CONTACT_FROM_EMAIL = oldFrom;
  }
});
