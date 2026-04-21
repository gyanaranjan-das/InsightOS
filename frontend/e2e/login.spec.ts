import { test, expect } from '@playwright/test';

test('login flow successfully redirects to dashboard', async ({ page }) => {
  // Mock backend responds with successful login
  await page.route('**/api/auth/login', async route => {
    const json = {
      user: { id: '1', email: 'admin@demo.com', name: 'Test Admin', role: 'OWNER' },
      org: { id: '1', name: 'Demo Org', slug: 'demo', plan: 'pro' },
      accessToken: 'fake_jwt_token',
      refreshToken: 'fake_refresh_token',
    };
    await route.fulfill({ json });
  });

  await page.goto('http://localhost:3000/login');
  
  // Wait for the form to be visible
  await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();

  // Fill in credentials
  await page.fill('input[type="email"]', 'admin@demo.com');
  await page.fill('input[type="password"]', 'demo1234');
  
  // Submit the form
  await page.click('button[type="submit"]');

  // Verify successful redirection and that dashboard loaded
  await page.waitForURL('http://localhost:3000/');
  await expect(page.getByRole('heading', { name: /Overview/i })).toBeVisible();
});
