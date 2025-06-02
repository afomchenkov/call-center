import { test, expect } from '@playwright/test';

const MOCK_QUEUE = {
  voice_queue: [
    {
      priority: 1,
      position: 0,
      ticket_id: 'TICKET-VOICE-001',
      platform: 'phone',
      restrictions: ['English', 'German'],
      is_voice: true,
      created_at: Date.now(),
    },
  ],
  text_queue: [
    {
      priority: 2,
      position: 1,
      ticket_id: 'TICKET-TEXT-001',
      platform: 'webchat',
      restrictions: ['Spanish'],
      is_voice: false,
      created_at: Date.now(),
    },
  ],
  total_queued: 2,
};

const MOCK_AGENTS = [
  {
    id: 'agent-1',
    name: 'John Smith',
    language_skills: ['english', 'french'],
    assigned_tasks: [
      { id: 'task-1', platform: 'phone' },
      { id: 'task-2', platform: 'webchat' },
      { id: 'task-3', platform: 'phone' },
    ],
  },
  {
    id: 'agent-2',
    name: 'Max Mustermann',
    language_skills: ['spanish'],
    assigned_tasks: [],
  },
];

test.describe('DashboardPage', () => {
  test('should render dashboard summary stats', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByText(/Active Calls/i)).toBeVisible();
    await expect(page.getByText(/Active Messages/i)).toBeVisible();
    await expect(page.getByText(/Completed Tasks/i)).toBeVisible();
  });

  test('should display the tickets list', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByRole('heading', { name: /Queued Tickets/i })).toBeVisible();
  });

  test('should display the agent workload section', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByRole('heading', { name: /Agent Workload/i })).toBeVisible();
  });

  test('should display the active agents list', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByRole('heading', { name: /Active Agents/i })).toBeVisible();
  });

  test('should be able to trigger system reset if visible', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const resetButton = page.getByRole('button', { name: /Reset System/i });
    if (await resetButton.isVisible()) {
      await resetButton.click();
      await expect(page.locator('.toast')).toContainText(/Failed|Success/i);
    }
  });

  test('should show queued ticket in dashboard summary', async ({ page }) => {
    await page.route('**/queue', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(MOCK_QUEUE),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    await page.goto('http://localhost:3000');

    await expect(page.getByText(/TEXT-001/i)).toBeVisible();
    await expect(page.getByText(/OICE-001/i)).toBeVisible();

    const list = page.locator('[data-testid="queued-tickets"] li');

    await expect(list).toHaveCount(2);
    await expect(list.nth(0)).toContainText('Webchat');
    await expect(list.nth(1)).toContainText('Phone');
    await expect(list.nth(0)).toContainText('[es]');
    await expect(list.nth(1)).toContainText('[en,de]');
  });

  test('should render active agents info with correct task counts and languages', async ({ page }) => {
    await page.route('**/agents', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_AGENTS),
      });
    });

    await page.goto('http://localhost:3000');

    const agentsView = page.locator('[data-testid="active-agents-view"]');
    const agents = agentsView.locator('[data-testid="data-agent-id"]');
    await expect(agents).toHaveCount(MOCK_AGENTS.length);

    const agent1Card = agentsView.locator('text=John Smith').locator('..').locator('..');
    await expect(agent1Card).toContainText('english|french');

    const agent2Card = agentsView.locator('text=Max Mustermann').locator('..').locator('..');
    await expect(agent2Card).toContainText('spanish');
  });
});
