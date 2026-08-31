import { test, expect } from '@playwright/test';

test('user can click a starter prompt and see a streamed AI reply', async ({ page }) => {
  // Mock the AI route so this test never calls the real API
  await page.route('**/api/chat', async (route) => {
    const events = [
      { type: 'start' },
      { type: 'text-start', id: 'msg-1' },
      { type: 'text-delta', id: 'msg-1', delta: 'Keep up the great work on your streak!' },
      { type: 'text-end', id: 'msg-1' },
      { type: 'finish' },
    ];

    const body =
      events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join('') + 'data: [DONE]\n\n';

    await route.fulfill({
      status: 200,
      headers: {
        'content-type': 'text/event-stream',
        'x-vercel-ai-ui-message-stream': 'v1',
      },
      body,
    });
  });

  await page.goto('/');

  // Primary flow: land on the dashboard, use a starter prompt, see the reply
  const starterButton = page.getByRole('button', {
    name: /how is my morning run streak/i,
  });
  await expect(starterButton).toBeVisible();
  await starterButton.click();

  await expect(
    page.getByText(/keep up the great work on your streak/i)
  ).toBeVisible({ timeout: 10000 });
});