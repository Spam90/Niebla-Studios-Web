const { test, expect } = require("@playwright/test");

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

test("accessibility menu adjusts text, toggles visual aids and persists settings", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Abrir opciones de accesibilidad" });
  await trigger.click();
  await expect(page.getByRole("heading", { name: "Accesibilidad" })).toBeVisible();
  await page.getByRole("button", { name: "Aumentar tamaño del texto" }).click();
  await page.getByRole("button", { name: "Aumentar tamaño del texto" }).click();
  await expect(page.locator("html")).toHaveClass(/a11y-text-120/);
  await expect(page.locator("#textSizeValue")).toHaveText("120%");
  const contrast = page.getByRole("button", { name: "Alto contraste" });
  await contrast.click();
  await expect(contrast).toHaveAttribute("aria-pressed", "true");
  const links = page.getByRole("button", { name: "Subrayar enlaces" });
  await links.click();
  await expect(links).toHaveAttribute("aria-pressed", "true");
  const motion = page.getByRole("button", { name: "Reducir animaciones" });
  await motion.click();
  await expect(motion).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/a11y-text-120/);
  await expect(page.locator("html")).toHaveClass(/a11y-high-contrast/);
  await expect(page.locator("html")).toHaveClass(/a11y-underline-links/);
  await expect(page.locator("html")).toHaveClass(/a11y-reduced-motion/);
  await page.getByRole("button", { name: "Abrir opciones de accesibilidad" }).click();
  await page.getByRole("button", { name: "Restablecer ajustes" }).click();
  await expect(page.locator("html")).not.toHaveClass(/a11y-text-120/);
  await expect(page.locator("html")).not.toHaveClass(/a11y-high-contrast/);
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
