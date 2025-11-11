import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display hero section with proper layout', async ({ page }) => {
    const heroSection = page.locator('.hero');
    await expect(heroSection).toBeVisible();
    
    const heroContainer = page.locator('.hero-container');
    await expect(heroContainer).toBeVisible();
    
    const heroContent = page.locator('.hero-content');
    await expect(heroContent).toBeVisible();
  });

  test('should display correct hero text content', async ({ page }) => {
    // Check main title
    const heroTitle = page.locator('.hero-title');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText("Hello, I'm");
    
    // Check name highlight
    const heroName = page.locator('.hero-name');
    await expect(heroName).toBeVisible();
    await expect(heroName).toHaveText('Bao Trinh');
    
    // Check subtitle
    const heroSubtitle = page.locator('.hero-subtitle');
    await expect(heroSubtitle).toBeVisible();
    await expect(heroSubtitle).toHaveText('Software Developer');
    
    // Check description
    const heroDescription = page.locator('.hero-description');
    await expect(heroDescription).toBeVisible();
    await expect(heroDescription).toContainText('Passionate full-stack developer');
    await expect(heroDescription).toContainText('modern web technologies');
  });

  test('should display CTA buttons with correct text', async ({ page }) => {
    const heroButtons = page.locator('.hero-buttons');
    await expect(heroButtons).toBeVisible();
    
    // Check View Resume button
    const resumeButton = page.locator('.btn.btn-primary:has-text("View Resume")');
    await expect(resumeButton).toBeVisible();
    await expect(resumeButton).toHaveText('View Resume');
    
    // Check See Projects button  
    const projectsButton = page.locator('.btn.btn-secondary:has-text("See Projects")');
    await expect(projectsButton).toBeVisible();
    await expect(projectsButton).toHaveText('See Projects');
  });

  test('should scroll to Resume section when clicking View Resume button', async ({ page }) => {
    const resumeButton = page.locator('.btn.btn-primary:has-text("View Resume")');
    await resumeButton.click();
    
    await page.waitForTimeout(1000); // Wait for smooth scroll
    
    // Check if Resume section is in view
    const resumeSection = page.locator('#resume');
    await expect(resumeSection).toBeVisible();
    
    const resumeSectionBox = await resumeSection.boundingBox();
    expect(resumeSectionBox.y).toBeLessThan(100);
  });

  test('should scroll to Projects section when clicking See Projects button', async ({ page }) => {
    const projectsButton = page.locator('.btn.btn-secondary:has-text("See Projects")');
    await projectsButton.click();
    
    await page.waitForTimeout(1000);
    
    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeVisible();
    
    const projectsSectionBox = await projectsSection.boundingBox();
    expect(projectsSectionBox.y).toBeLessThan(100);
  });

  test('should display profile placeholder image', async ({ page }) => {
    const heroImage = page.locator('.hero-image');
    await expect(heroImage).toBeVisible();
    
    const profilePlaceholder = page.locator('.profile-image-placeholder');
    await expect(profilePlaceholder).toBeVisible();
    
    const placeholderSvg = page.locator('.profile-placeholder');
    await expect(placeholderSvg).toBeVisible();
    
    // Check SVG dimensions
    await expect(placeholderSvg).toHaveAttribute('width', '200');
    await expect(placeholderSvg).toHaveAttribute('height', '200');
  });

  test('should display social media icons', async ({ page }) => {
    const socialLinks = page.locator('.social-links');
    await expect(socialLinks).toBeVisible();
    
    // Check all three social links exist
    const socialLinkItems = page.locator('.social-link');
    await expect(socialLinkItems).toHaveCount(3);
    
    // Check LinkedIn link
    const linkedinLink = socialLinkItems.nth(0);
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute('aria-label', 'LinkedIn');
    
    // Check GitHub link
    const githubLink = socialLinkItems.nth(1);
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('aria-label', 'GitHub');
    
    // Check Email link
    const emailLink = socialLinkItems.nth(2);
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('aria-label', 'Email');
  });

  test('should have responsive layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 });
    
    const heroContent = page.locator('.hero-content');
    await expect(heroContent).toBeVisible();
    
    // Hero elements should still be visible and accessible on mobile
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.hero-subtitle')).toBeVisible();
    await expect(page.locator('.hero-buttons')).toBeVisible();
    await expect(page.locator('.hero-image')).toBeVisible();
    await expect(page.locator('.social-links')).toBeVisible();
  });

  test('should have responsive layout on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const heroContent = page.locator('.hero-content');
    await expect(heroContent).toBeVisible();
    
    // All hero elements should be properly displayed on tablet
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.hero-subtitle')).toBeVisible();
    await expect(page.locator('.hero-description')).toBeVisible();
    await expect(page.locator('.hero-buttons')).toBeVisible();
    await expect(page.locator('.hero-image')).toBeVisible();
    await expect(page.locator('.social-links')).toBeVisible();
  });

  test('should have working hover effects on CTA buttons', async ({ page }) => {
    // Test hover on View Resume button
    const resumeButton = page.locator('.btn.btn-primary:has-text("View Resume")');
    await resumeButton.hover();
    
    // Should be able to click after hover (no broken interactions)
    await expect(resumeButton).toBeVisible();
    await expect(resumeButton).toBeEnabled();
    
    // Test hover on See Projects button
    const projectsButton = page.locator('.btn.btn-secondary:has-text("See Projects")');
    await projectsButton.hover();
    
    await expect(projectsButton).toBeVisible();
    await expect(projectsButton).toBeEnabled();
  });

  test('should have accessible social media links', async ({ page }) => {
    const socialLinks = page.locator('.social-link');
    
    // All social links should be focusable for accessibility
    for (let i = 0; i < 3; i++) {
      const link = socialLinks.nth(i);
      await expect(link).toBeVisible();
      await link.focus();
      await expect(link).toBeFocused();
    }
  });

  test('should maintain hero section layout during scroll', async ({ page }) => {
    const heroSection = page.locator('.hero');
    
    // Hero should be visible initially
    await expect(heroSection).toBeVisible();
    
    // Scroll down a bit but not past the hero section
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(200);
    
    // Hero should still be partially visible
    const heroBox = await heroSection.boundingBox();
    expect(heroBox.height).toBeGreaterThan(0);
  });
});