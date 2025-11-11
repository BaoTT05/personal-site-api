import { test, expect } from '@playwright/test';

test.describe('Navigation Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should display header with logo and navigation menu', async ({ page }) => {
    // Check header exists and is visible
    await expect(page.locator('.header')).toBeVisible();
    
    // Check logo/title
    await expect(page.locator('.header-title')).toHaveText('Bao Trinh');
    await expect(page.locator('.header-subtitle')).toHaveText('Software Developer');
    
    // Check navigation menu exists
    await expect(page.locator('.nav-menu')).toBeVisible();
  });

  test('should have correct navigation menu items', async ({ page }) => {
    const navLinks = page.locator('.nav-link');
    
    await expect(navLinks).toHaveCount(3);
    await expect(navLinks.nth(0)).toHaveText('About Me');
    await expect(navLinks.nth(1)).toHaveText('Resume');
    await expect(navLinks.nth(2)).toHaveText('Projects');
  });

  test('should scroll to About Me section when clicking About Me nav link', async ({ page }) => {
    // Click About Me navigation link
    await page.click('button.nav-link:has-text("About Me")');
    
    // Wait for smooth scrolling to complete
    await page.waitForTimeout(1000);
    
    // Check if About Me section is in view
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();
    
    // Verify we scrolled to the right position
    const aboutSectionBox = await aboutSection.boundingBox();
    expect(aboutSectionBox.y).toBeLessThan(100); // Should be near top of viewport
  });

  test('should scroll to Resume section when clicking Resume nav link', async ({ page }) => {
    await page.click('button.nav-link:has-text("Resume")');
    await page.waitForTimeout(1000);
    
    const resumeSection = page.locator('#resume');
    await expect(resumeSection).toBeVisible();
    
    const resumeSectionBox = await resumeSection.boundingBox();
    expect(resumeSectionBox.y).toBeLessThan(100);
  });

  test('should scroll to Projects section when clicking Projects nav link', async ({ page }) => {
    await page.click('button.nav-link:has-text("Projects")');
    await page.waitForTimeout(1000);
    
    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeVisible();
    
    const projectsSectionBox = await projectsSection.boundingBox();
    expect(projectsSectionBox.y).toBeLessThan(100);
  });

  test('should show mobile menu toggle button on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 480, height: 800 });
    
    const mobileToggle = page.locator('.mobile-menu-toggle');
    await expect(mobileToggle).toBeVisible();
    
    // Check toggle has proper aria label
    await expect(mobileToggle).toHaveAttribute('aria-label', 'Toggle navigation menu');
  });

  test('should toggle mobile menu when clicking toggle button', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 });
    
    const mobileToggle = page.locator('.mobile-menu-toggle');
    const navMenu = page.locator('.nav-menu');
    
    // Initially menu should not be open
    await expect(navMenu).not.toHaveClass(/nav-menu-open/);
    
    // Click toggle to open menu
    await mobileToggle.click();
    await expect(navMenu).toHaveClass(/nav-menu-open/);
    
    // Click toggle again to close menu
    await mobileToggle.click();
    await expect(navMenu).not.toHaveClass(/nav-menu-open/);
  });

  test('should close mobile menu when clicking a navigation link', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 });
    
    const mobileToggle = page.locator('.mobile-menu-toggle');
    const navMenu = page.locator('.nav-menu');
    
    // Open mobile menu
    await mobileToggle.click();
    await expect(navMenu).toHaveClass(/nav-menu-open/);
    
    // Click a navigation link
    await page.click('button.nav-link:has-text("About Me")');
    
    // Menu should be closed after clicking navigation link
    await expect(navMenu).not.toHaveClass(/nav-menu-open/);
  });

  test('should have sticky header behavior', async ({ page }) => {
    // Get initial header position
    const header = page.locator('.header');
    const initialHeaderBox = await header.boundingBox();
    
    // Scroll down significantly
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    
    // Header should still be visible (sticky behavior)
    await expect(header).toBeVisible();
    
    // Header should be at top of viewport when sticky
    const stickyHeaderBox = await header.boundingBox();
    expect(stickyHeaderBox.y).toBeLessThanOrEqual(10); // Allow for small margin
  });

  test('should maintain header visibility during scroll', async ({ page }) => {
    const header = page.locator('.header');
    
    // Test scrolling to different positions
    const scrollPositions = [500, 1000, 1500, 2000];
    
    for (const position of scrollPositions) {
      await page.evaluate((pos) => window.scrollTo(0, pos), position);
      await page.waitForTimeout(200);
      await expect(header).toBeVisible();
    }
  });
});