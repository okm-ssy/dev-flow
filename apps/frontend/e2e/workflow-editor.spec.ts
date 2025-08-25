import { test, expect } from '@playwright/test';

test.describe('Workflow Editor', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Check if the main elements are present
    await expect(page.locator('h3:has-text("Node Palette")')).toBeVisible();
    await expect(page.locator('h3:has-text("Export Options")')).toBeVisible();
    await expect(page.locator('[data-testid="vue-flow"]')).toBeVisible();
  });

  test('should add nodes without overlapping', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the application to load
    await page.waitForSelector('h3:has-text("Node Palette")');
    
    // Add multiple nodes
    await page.click('button:has-text("Input")');
    await page.click('button:has-text("Process")');
    await page.click('button:has-text("Output")');
    
    // Wait for nodes to be rendered
    await page.waitForTimeout(1000);
    
    // Get all nodes
    const nodes = await page.locator('.custom-node').all();
    expect(nodes.length).toBeGreaterThanOrEqual(3);
    
    // Check that nodes are positioned differently
    const positions = [];
    for (const node of nodes) {
      const box = await node.boundingBox();
      if (box) {
        positions.push({ x: box.x, y: box.y });
      }
    }
    
    // Verify no two nodes have the same position
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        expect(positions[i].x !== positions[j].x || positions[i].y !== positions[j].y).toBeTruthy();
      }
    }
  });

  test('should open node editor when clicking a node', async ({ page }) => {
    await page.goto('/');
    
    // Add a node first
    await page.click('button:has-text("Input")');
    await page.waitForTimeout(1000);
    
    // Click on the node
    await page.click('.custom-node');
    
    // Check if node editor panel appears
    await expect(page.locator('h3:has-text("Node Properties")')).toBeVisible();
  });

  test('should export workflow as JSON', async ({ page }) => {
    await page.goto('/');
    
    // Add some nodes
    await page.click('button:has-text("Input")');
    await page.click('button:has-text("Output")');
    await page.waitForTimeout(1000);
    
    // Set up download promise before triggering download
    const downloadPromise = page.waitForEvent('download');
    
    // Click export button
    await page.click('button:has-text("Export as JSON")');
    
    // Wait for download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.json$/);
  });

  test('should show error notification when API fails', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/workflows', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      });
    });
    
    await page.goto('/');
    
    // Wait for error notification
    await expect(page.locator('[data-testid="error-notification"]')).toBeVisible();
  });

  test('should connect nodes with edges', async ({ page }) => {
    await page.goto('/');
    
    // Add two nodes
    await page.click('button:has-text("Input")');
    await page.click('button:has-text("Output")');
    await page.waitForTimeout(1000);
    
    // Get node handles
    const sourceHandle = page.locator('.custom-node').first().locator('[data-handletype="source"]');
    const targetHandle = page.locator('.custom-node').last().locator('[data-handletype="target"]');
    
    // Connect nodes by dragging from source to target
    await sourceHandle.hover();
    await page.mouse.down();
    await targetHandle.hover();
    await page.mouse.up();
    
    // Check if edge was created
    await expect(page.locator('.vue-flow__edge')).toBeVisible();
  });

  test('should show different node types with different colors', async ({ page }) => {
    await page.goto('/');
    
    // Add different types of nodes
    await page.click('button:has-text("Input")');
    await page.click('button:has-text("Database")');
    await page.click('button:has-text("API Call")');
    await page.waitForTimeout(1000);
    
    // Check that nodes have different border colors
    const inputNode = page.locator('.custom-node:has-text("Input")');
    const databaseNode = page.locator('.custom-node:has-text("Database")');
    const apiNode = page.locator('.custom-node:has-text("API Call")');
    
    await expect(inputNode).toHaveClass(/border-green-400/);
    await expect(databaseNode).toHaveClass(/border-purple-400/);
    await expect(apiNode).toHaveClass(/border-indigo-400/);
  });
});