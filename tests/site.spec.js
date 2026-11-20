const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

test("home exposes working contact fallbacks and social metadata", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#siteHeader")).toHaveCSS("position", "fixed");
  await expect(page.locator("#emailLink")).toHaveAttribute("href", "mailto:nieblastudiosrd@gmail.com");
  await expect(page.locator("#copyEmail")).toBeVisible();
  await expect(page.locator("#whatsappLink")).toBeHidden();
  await expect(page.locator("#footerWhatsappItem")).toBeHidden();
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "es_DO");
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1254");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nieblastudio.devs.surf/");
});

test("desktop navigation inerts hidden panels and browser history restores the previous panel", async ({ page }) => {
  await page.goto("/");
  await page.locator('.site-nav a[href="#preguntas"]').click();
  await expect(page).toHaveURL(/#preguntas$/);
  await expect(page.locator("#preguntas")).toHaveJSProperty("inert", false);
  await expect(page.locator("#inicio")).toHaveJSProperty("inert", true);
  await page.goBack();
  await expect(page.locator("#inicio")).toHaveJSProperty("inert", false);
});

test("Space toggles a focused plan disclosure instead of navigating away", async ({ page }) => {
  await page.goto("/");
  await page.locator('.site-nav a[href="#servicios"]').click();
  const summary = page.locator(".plan-service summary").first();
  await summary.click();
  await expect(summary.locator("..")).not.toHaveAttribute("open", "");
  await summary.focus();
  await page.keyboard.press("Space");
  await expect(summary.locator("..")).toHaveAttribute("open", "");
});

test("mobile first-use cue is visible and disappears after panel navigation", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".mobile-swipe-cue")).toBeVisible();
  await page.locator("#menuToggle").click();
  await page.locator('.site-nav a[href="#servicios"]').click();
  await expect(page.locator("#servicios")).toHaveJSProperty("inert", false);
  await expect(page.locator(".mobile-swipe-cue")).toBeHidden();
  await context.close();
});

test("demos tabs work and product administration can edit a product", async ({ page }) => {
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

test("all internal homepage links resolve to an element", async ({ page }) => {
  await page.goto("/");
  const broken = await page.locator('a[href^="#"]').evaluateAll(links =>
    links.map(link => link.getAttribute("href").slice(1))
      .filter(id => id && !document.getElementById(decodeURIComponent(id)))
  );
  expect(broken).toEqual([]);
});

test("accessibility preferences scale text, persist settings and reset", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Abrir opciones de accesibilidad" });
  await trigger.click();
  await expect(page.getByRole("heading", { name: "Preferencias de accesibilidad" })).toBeVisible();
  const increase = page.getByRole("button", { name: /Aumentar escala del texto/ });
  for (let i = 0; i < 4; i++) await increase.click();
  await expect(page.locator("#textSizeValue")).toHaveText("200%");
  await expect(page.locator("html")).toHaveCSS("font-size", "32px");
  await expect(increase).toBeDisabled();
  const contrast = page.getByRole("button", { name: "Alto contraste" });
  await contrast.click();
  await expect(contrast).toHaveAttribute("aria-pressed", "true");
  const links = page.getByRole("button", { name: "Subrayar enlaces" });
  await links.click();
  await expect(links).toHaveAttribute("aria-pressed", "true");
  const motion = page.getByRole("button", { name: "Reducir movimiento" });
  await motion.click();
  await expect(motion).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.locator("#textSizeValue")).toHaveText("200%");
  await expect(page.locator("html")).toHaveClass(/a11y-high-contrast/);
  await expect(page.locator("html")).toHaveClass(/a11y-underline-links/);
  await expect(page.locator("html")).toHaveClass(/a11y-reduced-motion/);
  await page.getByRole("button", { name: "Abrir opciones de accesibilidad" }).click();
  await page.getByRole("button", { name: "Restablecer preferencias" }).click();
  await expect(page.locator("#textSizeValue")).toHaveText("100%");
  await expect(page.locator("html")).not.toHaveClass(/a11y-high-contrast/);
  await expect(page.locator("html")).not.toHaveClass(/a11y-reduced-motion/);
});

test("accessibility menu closes on outside interaction without stealing focus", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Abrir opciones de accesibilidad" });
  await trigger.click();
  await expect(page.locator("#accessibilityClose")).toBeFocused();
  await page.locator(".brand").click();
  await expect(page.locator("#accessibilityPanel")).toBeHidden();
  await expect(page.locator(".brand")).toBeFocused();
});
test("accessibility menu supports Escape and restores focus to its trigger", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Abrir opciones de accesibilidad" });
  await trigger.click();
  await expect(page.locator("#accessibilityClose")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#accessibilityPanel")).toBeHidden();
  await expect(trigger).toBeFocused();
});


test("homepage has no automated WCAG 2.2 AA violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    results.violations,
    JSON.stringify(results.violations.map(item => ({
      id: item.id,
      impact: item.impact,
      nodes: item.nodes.map(node => node.target)
    })), null, 2)
  ).toEqual([]);
});

test("demo page has no automated WCAG 2.2 AA violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demos/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    results.violations,
    JSON.stringify(results.violations.map(item => ({
      id: item.id,
      impact: item.impact,
      nodes: item.nodes.map(node => node.target)
    })), null, 2)
  ).toEqual([]);
});


test("mobile navigation works by keyboard at a 320px viewport without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  const toggle = page.locator("#menuToggle");
  await expect(toggle).toBeVisible();
  await expect(page.locator("#siteNav")).toBeHidden();
  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", 320);
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#siteNav")).toHaveClass(/open/);
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator('.site-nav a[href="#servicios"]')).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#siteNav")).not.toHaveClass(/open/);
  await expect(toggle).toBeFocused();
});

test("accessibility contrast and reduced motion preferences change page styles", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir opciones de accesibilidad" }).click();
  await page.getByRole("button", { name: "Alto contraste" }).click();
  await expect(page.locator("html")).toHaveClass(/a11y-high-contrast/);
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await page.getByRole("button", { name: "Reducir movimiento" }).click();
  await expect(page.locator("html")).toHaveClass(/a11y-reduced-motion/);
  await expect(page.locator(".hero")).toHaveCSS("scroll-behavior", "auto");
  await page.getByRole("button", { name: "Restablecer preferencias" }).click();
});

test("all rendered images declare an alt attribute, including decorative empty alternatives", async ({ page }) => {
  await page.goto("/");
  const missingAlt = await page.locator("img").evaluateAll(images =>
    images.filter(image => !image.hasAttribute("alt")).map(image => image.getAttribute("src"))
  );
  expect(missingAlt).toEqual([]);
});

test("mobile homepage has no automated WCAG 2.2 AA violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    results.violations,
    JSON.stringify(results.violations.map(item => ({
      id: item.id,
      impact: item.impact,
      nodes: item.nodes.map(node => node.target)
    })), null, 2)
  ).toEqual([]);
});


test("demo tabs support arrow, Home and End keyboard navigation and expose each panel accessibly", async ({ page }) => {
  await page.goto("/demos/");
  const catalog = page.getByRole("tab", { name: /Catálogo digital/ });
  const management = page.getByRole("tab", { name: /Gestión/ });
  const bookings = page.getByRole("tab", { name: /Reservas/ });
  await catalog.focus();
  await page.keyboard.press("ArrowRight");
  await expect(management).toBeFocused();
  await expect(management).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel", { name: /Gestión/ })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(bookings).toBeFocused();
  await expect(bookings).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(catalog).toBeFocused();
  await expect(catalog).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(bookings).toBeFocused();
  await expect(bookings).toHaveAttribute("aria-selected", "true");
});

test("all demo tabs have no automated WCAG 2.2 AA violations in their active state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demos/");
  for (const name of ["catalogo", "gestion", "reservas"]) {
    await page.locator('[data-tab="' + name + '"]').click();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations,
      name + ": " + JSON.stringify(results.violations.map(item => ({
        id: item.id,
        impact: item.impact,
        nodes: item.nodes.map(node => node.target)
      })), null, 2)
    ).toEqual([]);
  }
});

test("homepage and demos reflow at a 320px viewport without document-level horizontal overflow", async ({ page }) => {
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


test("skip link is revealed on focus and moves keyboard users to main content", async ({ page }) => {
  await page.goto("/");
  const skip = page.getByRole("link", { name: "Saltar al contenido" });
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator("main#main")).toBeVisible();
});

test("expanded mobile navigation and accessibility panel have no automated WCAG 2.2 AA violations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#menuToggle").click();
  let results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map(item => ({id:item.id,impact:item.impact,nodes:item.nodes.map(node=>node.target)}))).toEqual([]);
  await page.locator("#menuToggle").click();
  await page.getByRole("button", { name: "Abrir opciones de accesibilidad" }).click();
  results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map(item => ({id:item.id,impact:item.impact,nodes:item.nodes.map(node=>node.target)}))).toEqual([]);
});

test("mobile reflow remains usable at 200% text scale with accessibility panel open", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir opciones de accesibilidad" }).click();
  const increase = page.getByRole("button", { name: /Aumentar escala del texto/ });
  for (let i = 0; i < 4; i++) await increase.click();
  await expect(page.locator("#textSizeValue")).toHaveText("200%");
  await expect(page.locator("#accessibilityPanel")).toBeVisible();
  const layout = await page.evaluate(() => {
    const panel = document.querySelector("#accessibilityPanel").getBoundingClientRect();
    return {
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      panelLeft: panel.left,
      panelRight: panel.right
    };
  });
  expect(layout.document, JSON.stringify(layout)).toBeLessThanOrEqual(320);
  expect(layout.panelLeft, JSON.stringify(layout)).toBeGreaterThanOrEqual(0);
  expect(layout.panelRight, JSON.stringify(layout)).toBeLessThanOrEqual(layout.viewport);
});

test("contact form sends the entered information and confirms success", async ({ page }) => {
  let requestBody;
  await page.route("**/api/contact", async route => {
    requestBody = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.goto("/#contacto");
  await page.locator("#contactName").fill("Cliente de prueba");
  await page.locator("#contactEmail").fill("cliente@example.com");
  await page.locator("#contactService").selectOption("Catálogo digital");
  await page.locator("#contactMessage").fill("Necesito un catálogo para organizar los productos de mi negocio.");
  await page.locator("#contactSubmit").click();
  await expect(page.locator("#contactFormStatus")).toContainText("Consulta enviada");
  expect(requestBody).toMatchObject({ name: "Cliente de prueba", email: "cliente@example.com", service: "Catálogo digital" });
});
