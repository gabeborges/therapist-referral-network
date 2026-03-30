import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("renders hero and CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Therapist Referral Network/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /sign/i })).toBeVisible();
  });

  test("skip-to-content link is accessible on focus", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
  });
});

test.describe("Auth redirect", () => {
  test("unauthenticated user is redirected to sign-in for protected routes", async ({ page }) => {
    await page.goto("/referrals");
    await page.waitForURL(/\/auth\/signin/);
    expect(page.url()).toContain("/auth/signin");
    expect(page.url()).toContain("callbackUrl");
  });

  test("sign-in page renders Google OAuth button", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
  });
});

test.describe("Shareable referral link (unauthenticated)", () => {
  test("non-existent slug returns 404", async ({ page }) => {
    const response = await page.goto("/r/nonexistent-slug-12345");
    // Page should still render (Next.js notFound renders a 404 page)
    expect(response?.status()).toBe(404);
  });
});

test.describe("Fulfillment page", () => {
  test("invalid token shows error message", async ({ page }) => {
    await page.goto("/referrals/fulfill/invalid-token-12345");
    await expect(
      page.getByRole("heading", { name: /invalid or expired/i }),
    ).toBeVisible();
  });
});

test.describe("Accessibility basics", () => {
  test("main content landmark exists", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main#main-content")).toBeVisible();
  });

  test("html has lang attribute", async ({ page }) => {
    await page.goto("/");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("en");
  });
});
