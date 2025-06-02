import { test, expect } from '@playwright/test';

const MOCK_AGENT = {
  id: 'c884c532-037b-4380-852d-d6d4d71b37c3',
  name: 'John Smith',
  language_skills: ['en', 'fr'],
  assigned_tasks: [
    { id: 'task-1', platform: 'voice' },
    { id: 'task-2', platform: 'chat' },
  ],
};

test.describe('AgentsPage', () => {
  const agentId = 'c884c532-037b-4380-852d-d6d4d71b37c3';
  const pageUrl = `/agents/${agentId}`;

  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:3000${pageUrl}`);

    await page.route(`**/agents/${agentId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_AGENT),
      });
    });
  });

  test('should load agent data and displays assigned tasks', async ({ page }) => {
    await expect(page.locator('h2')).toContainText(/Tasks assigned to John Smith/i);
    await expect(page.getByText(/Task ID: task-1/i)).toBeVisible();
    await expect(page.getByText(/Task ID: task-2/i)).toBeVisible();
  });

  test('should complete a task when clicked', async ({ page }) => {
    const taskButton1 = page.locator('button:has-text("Task ID: task-1")');
    await expect(taskButton1).toBeVisible();
    const [postRequest1] = await Promise.all([
      page.waitForRequest(
        (req) =>
          req.url().includes(`/api/v1/tasks/complete?agent_identifier=${agentId}&task_id=task-1`) &&
          req.method() === 'POST',
      ),
      taskButton1.click(),
    ]);

    const body1 = JSON.parse(postRequest1.postData() || '{}');
    expect(body1).toEqual({});

    const taskButton2 = page.locator('button:has-text("Task ID: task-2")');
    await expect(taskButton2).toBeVisible();
    const [postRequest2] = await Promise.all([
      page.waitForRequest(
        (req) =>
          req.url().includes(`/api/v1/tasks/complete?agent_identifier=${agentId}&task_id=task-2`) &&
          req.method() === 'POST',
      ),
      taskButton2.click(),
    ]);

    const body2 = JSON.parse(postRequest2.postData() || '{}');
    expect(body2).toEqual({});
  });
});
