import { test, expect } from '@playwright/test';
import { WidgetPage } from './widget.page';

test.describe('Uchi.ru widget', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({ page }) => {
    widgetPage = new WidgetPage(page);

    const cookieButtons = page.locator('._UCHI_COOKIE__button:visible');
    await page.addLocatorHandler(cookieButtons.first(), async () => {
      // Баннер может двигаться или исчезнуть во время проверки.
      await cookieButtons.evaluateAll(buttons => {
        for (const button of buttons) {
          if (button.isConnected) (button as HTMLElement).click();
        }
      });
    }, { noWaitAfter: true });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('opens', async () => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible();
  });

  test('opens support form from a popular article', async () => {
    await widgetPage.openWidget();

    await widgetPage.getPopularArticles().first().click();
    await widgetPage.clickWriteToUs();

    await expect(widgetPage.getTitle()).toHaveText('Связь с поддержкой');
  });

  test('shows popular articles', async () => {
    await widgetPage.openWidget();

    const firstArticle = widgetPage.getPopularArticles().first();
    await expect(firstArticle).toBeVisible();
    await expect(firstArticle).toHaveText(/\S/);
  });
});
