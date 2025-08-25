import { test, expect } from '@playwright/test';

test.describe('Node Palette', () => {
  test('should display all available node types', async ({ page }) => {
    await page.goto('/');
    
    // Check that all node types are present in the palette
    const expectedNodeTypes = [
      'Input',
      'Process', 
      'Condition',
      'Database',
      'Output',
      'API Call',
      'Script',
      'Transform',
      'Trigger'
    ];
    
    for (const nodeType of expectedNodeTypes) {
      await expect(page.locator(`button:has-text("${nodeType}")`)).toBeVisible();
    }
  });

  test('should add nodes when clicking palette buttons', async ({ page }) => {
    await page.goto('/');
    
    // Initially no nodes should be present
    await expect(page.locator('.custom-node')).toHaveCount(0);
    
    // Add an input node
    await page.click('button:has-text("Input")');
    await page.waitForTimeout(500);
    
    // Check that node was added
    await expect(page.locator('.custom-node')).toHaveCount(1);
    await expect(page.locator('.custom-node:has-text("Input")')).toBeVisible();
  });

  test('should show correct icons for node types', async ({ page }) => {
    await page.goto('/');
    
    // Check that buttons have icons (svg elements)
    const buttons = await page.locator('.node-palette button').all();
    
    for (const button of buttons) {
      const icon = button.locator('svg');
      await expect(icon).toBeVisible();
    }
  });

  test('should create nodes with unique IDs', async ({ page }) => {
    await page.goto('/');
    
    // Add the same type of node multiple times
    await page.click('button:has-text("Input")');
    await page.waitForTimeout(100);
    await page.click('button:has-text("Input")');
    await page.waitForTimeout(100);
    await page.click('button:has-text("Input")');
    await page.waitForTimeout(500);
    
    // All nodes should be present (unique IDs prevent conflicts)
    await expect(page.locator('.custom-node')).toHaveCount(3);
  });
});