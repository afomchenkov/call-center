import { test, expect } from '@playwright/test';

test.describe('AgentsPage', () => {
  const agentId = 'c884c532-037b-4380-852d-d6d4d71b37c3';
  const pageUrl = `/agents/${agentId}`;

  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:3000${pageUrl}`);
  });

  test('should load agent data and displays assigned tasks', async ({ page }) => {
    await page.waitForSelector('h2:has-text("Tasks assigned")', { timeout: 10000 });
    await expect(page.locator('h2')).toContainText('Tasks assigned');
    
    const taskButton = page.locator('button:has-text("Task ID:")');
    if (await taskButton.count()) {
      await expect(taskButton.first()).toBeVisible();
    } else {
      await expect(page.getByText(/no tasks assigned/i)).toBeVisible();
    }
  });

  test('should complete a task when clicked', async ({ page }) => {
    const taskButton = page.locator('button:has-text("Task ID:")');

    if (await taskButton.count()) {
      await taskButton.first().click();
      await expect(page.getByText(/completed/i)).toBeVisible();
    } else {
      test.skip(true, 'No tasks available to complete');
    }
  });
});
