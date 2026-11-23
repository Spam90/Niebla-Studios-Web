const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

test("homepage clearly presents Niebla Studios as a web and software agency", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ideas que toman forma.");
  await expect(page.getByRole("heading", { name: /Desarrollo web/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Desarrollo de software/ })).toBeVisible();
  await expect(page.locator("#servicios")).toContainText("Catálogos digitales");
  await expect(page.locator("#servicios")).toContainText("Sistemas de gestión");
  await expect(page.locator("#proyectos")).toContainText("DEMO CONCEPTUAL");
  await expect(page.locator("#agencia")).not.toContainText(/JEREMIAS|NELXUS/i);
  await expect(page.locator('#contacto a.contact-mail')).toHaveAttribute("href", /nieblastudiosrd@gmail.com/);
});

test("homepage metadata and canonical URL are configured", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Niebla Studios/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /desarrollo web y software/i);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Niebla Studios/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://nieblastudio.devs.surf/assets/logo.jpg");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nieblastudio.devs.surf/");
});

test("desktop navigation reaches every primary section", async ({ page }) => {
  await page.goto("/");
  for (const [label, id] of [["Servicios", "servicios"], ["Proyectos", "proyectos"], ["Proceso", "proceso"], ["Agencia", "agencia"]]) {
    await page.locator("#navLinks").getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(new RegExp("#" + id + "$"));
    await expect(page.locator("#" + id)).toBeVisible();
  }
});

test("all internal homepage links resolve to an element", async ({ page }) => {
  await page.goto("/");
  const broken = await page.locator('a[href^="#"]').evaluateAll(links =>
    links.map(link => link.getAttribute("href").slice(1))
      .filter(id => id && !document.getElementById(decodeURIComponent(id)))
  );
  expect(broken).toEqual([]);
});

test("mobile navigation opens, supports keyboard and closes after navigation at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  const toggle = page.locator("#menuBtn");
  const nav = page.locator("#navLinks");
  await expect(toggle).toBeVisible();
  await expect(nav).toBeHidden();
  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", 320);
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(nav).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(nav.getByRole("link", { name: "Servicios" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(nav).toBeHidden();
  await expect(page).toHaveURL(/#servicios$/);
});

test("FAQ disclosures open and close with keyboard interaction", async ({ page }) => {
  await page.goto("/");
  const summary = page.locator("#preguntas summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(summary.locator("..")).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(summary.locator("..")).not.toHaveAttribute("open", "");
});

test("all rendered homepage images declare an alt attribute", async ({ page }) => {
  await page.goto("/");
  const missingAlt = await page.locator("img").evaluateAll(images =>
    images.filter(image => !image.hasAttribute("alt")).map(image => image.getAttribute("src"))
  );
  expect(missingAlt).toEqual([]);
});

test("skip link focuses the main content", async ({ page }) => {
  await page.goto("/");
  const skip = page.getByRole("link", { name: "Saltar al contenido" });
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contenido$/);
  await expect(page.locator("main#contenido")).toBeFocused();
});

test("homepage has no automated WCAG 2.2 AA violations on desktop", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map(item => ({id:item.id,impact:item.impact,nodes:item.nodes.map(node=>node.target)}))).toEqual([]);
});

test("homepage has no automated WCAG 2.2 AA violations on mobile", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map(item => ({id:item.id,impact:item.impact,nodes:item.nodes.map(node=>node.target)}))).toEqual([]);
});

test("demo tabs work and product administration can edit a product", async ({ page }) => {
  await page.goto("/demos/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nieblastudio.devs.surf/demos/");
  await expect(page.getByRole("tablist")).toBeVisible();
  await page.getByRole("tab", { name: /Gestión/ }).click();
  await expect(page.locator("#gestion")).toHaveClass(/active/);
  await page.getByRole("tab", { name: /Catálogo/ }).click();
  await page.locator("#adminToggle").click();
  await page.locator('[data-edit-product="1"]').click();
  await page.locator("#newName").fill("Café editado");
  await page.locator("#productSubmit").click();
  await expect(page.locator("#products")).toContainText("Café editado");
  await expect(page.locator("#adminProducts")).toContainText("Café editado");
});

test("management demo exports a CSV file", async ({ page }) => {
  await page.goto("/demos/#gestion");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#exportCsv").click()
  ]);
  expect(download.suggestedFilename()).toBe("registros-demo.csv");
});

test("demo tabs support arrow, Home and End keyboard navigation", async ({ page }) => {
  await page.goto("/demos/");
  const catalog = page.getByRole("tab", { name: /Catálogo digital/ });
  const management = page.getByRole("tab", { name: /Gestión/ });
  const bookings = page.getByRole("tab", { name: /Reservas/ });
  await catalog.focus();
  await page.keyboard.press("ArrowRight");
  await expect(management).toBeFocused();
  await expect(management).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowRight");
  await expect(bookings).toBeFocused();
  await page.keyboard.press("Home");
  await expect(catalog).toBeFocused();
  await page.keyboard.press("End");
  await expect(bookings).toBeFocused();
});

test("demo page has no automated WCAG 2.2 AA violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demos/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map(item => ({id:item.id,impact:item.impact,nodes:item.nodes.map(node=>node.target)}))).toEqual([]);
});

test("homepage and demos reflow at 320px without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  for (const path of ["/", "/demos/"]) {
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth
    }));
    expect(dimensions.document, path + " document overflow: " + JSON.stringify(dimensions)).toBeLessThanOrEqual(320);
    expect(dimensions.body, path + " body overflow: " + JSON.stringify(dimensions)).toBeLessThanOrEqual(320);
  }
});
