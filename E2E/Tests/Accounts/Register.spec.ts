import { BASE_URL, IS_BILLING_ENABLED, IS_USER_REGISTERED } from "../../Config";
import { Page, expect, test, Response } from "@playwright/test";
import URL from "Common/Types/API/URL";
import Faker from "Common/Utils/Faker";

test.describe("Account Registration", () => {
  test("should register a new account", async ({ page }: { page: Page }) => {
    if (IS_USER_REGISTERED) {
      // pass this test if user is already registered
      return;
    }

    // please make sure the dashboard is up before signing up the user.
    let dashboardPageResult: Response | null = await page.goto(
      URL.fromString(BASE_URL.toString()).addRoute("/dashboard").toString(),
    );

    while (
      dashboardPageResult?.status() === 504 ||
      dashboardPageResult?.status() === 502
    ) {
      try {
        // reload page if it fails to load
        dashboardPageResult = await page.reload();
      } catch {
        // reload page if it fails to load
        dashboardPageResult = await page.goto(
          URL.fromString(BASE_URL.toString()).addRoute("/dashboard").toString(),
        );
      }
    }

    let pageResult: Response | null = await page.goto(
      URL.fromString(BASE_URL.toString())
        .addRoute("/accounts/register")
        .toString(),
    );

    while (pageResult?.status() === 504 || pageResult?.status() === 502) {
      try {
        // reload page if it fails to load
        pageResult = await page.reload();
      } catch {
        // reload page if it fails to load
        pageResult = await page.goto(
          URL.fromString(BASE_URL.toString())
            .addRoute("/accounts/register")
            .toString(),
        );
      }
    }

    await page.getByTestId("email").click();
    await page.getByTestId("email").fill(Faker.generateEmail().toString());
    await page.getByTestId("email").press("Tab");
    await page.getByTestId("name").fill("sample");
    await page.getByTestId("name").press("Tab");

    if (IS_BILLING_ENABLED) {
      await page.getByTestId("companyName").fill("sample");
      await page.getByTestId("companyName").press("Tab");
      await page.getByTestId("companyPhoneNumber").fill("+1234567890");
      await page.getByTestId("companyPhoneNumber").press("Tab");
    }

    await page.getByTestId("password").fill("sample");
    await page.getByTestId("password").press("Tab");
    await page.getByTestId("confirmPassword").fill("sample");
    await page.getByTestId("Sign Up").click();

    // wait for navigation with base url
    await page.waitForURL(
      URL.fromString(BASE_URL.toString())
        .addRoute("/dashboard/welcome")
        .toString(),
    );
    expect(page.url()).toBe(
      URL.fromString(BASE_URL.toString())
        .addRoute("/dashboard/welcome")
        .toString(),
    );

    await page.getByTestId("create-new-project-button").click();
  });
});
