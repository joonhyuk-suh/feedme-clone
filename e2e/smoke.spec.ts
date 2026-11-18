import { expect, test } from "@playwright/test";

test("홈 화면이 열리고 FEED-ME 제목과 입력란이 보인다", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("FEED-ME");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("FEED-ME");
  await expect(page.getByLabel("웹 페이지 URL")).toBeVisible();
});
