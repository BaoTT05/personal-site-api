import { test, expect } from '@playwright/test';

test.describe('About Me Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display About Me section with proper structure', async ({ page }) => {
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();
    await expect(aboutSection).toHaveClass(/about-me/);
    
    const container = aboutSection.locator('.container');
    await expect(container).toBeVisible();
  });

  test('should display section header with title and divider', async ({ page }) => {
    const sectionHeader = page.locator('.about-me .section-header');
    await expect(sectionHeader).toBeVisible();
    
    const sectionTitle = page.locator('.about-me .section-title');
    await expect(sectionTitle).toBeVisible();
    await expect(sectionTitle).toHaveText('About Me');
    
    const sectionDivider = page.locator('.about-me .section-divider');
    await expect(sectionDivider).toBeVisible();
  });

  test('should display about content with intro text', async ({ page }) => {
    const aboutContent = page.locator('.about-content');
    await expect(aboutContent).toBeVisible();
    
    const aboutText = page.locator('.about-text');
    await expect(aboutText).toBeVisible();
    
    const aboutIntro = page.locator('.about-intro');
    await expect(aboutIntro).toBeVisible();
    await expect(aboutIntro).toContainText("I'm a passionate software developer");
    await expect(aboutIntro).toContainText('full-stack development');
  });

  test('should display all about detail items', async ({ page }) => {
    const aboutDetails = page.locator('.about-details');
    await expect(aboutDetails).toBeVisible();
    
    const aboutItems = page.locator('.about-item');
    await expect(aboutItems).toHaveCount(3);
    
    // Check Background section
    const backgroundItem = aboutItems.nth(0);
    await expect(backgroundItem.locator('h3')).toHaveText('Background');
    await expect(backgroundItem.locator('p')).toContainText('frontend and backend development');
    await expect(backgroundItem.locator('p')).toContainText('cloud architecture');
    
    // Check Philosophy section
    const philosophyItem = aboutItems.nth(1);
    await expect(philosophyItem.locator('h3')).toHaveText('Philosophy');
    await expect(philosophyItem.locator('p')).toContainText('clean, maintainable code');
    await expect(philosophyItem.locator('p')).toContainText('Continuous learning');
    
    // Check Interests section
    const interestsItem = aboutItems.nth(2);
    await expect(interestsItem.locator('h3')).toHaveText('Interests');
    await expect(interestsItem.locator('p')).toContainText('exploring new technologies');
    await expect(interestsItem.locator('p')).toContainText('open source projects');
  });

  test('should display Technical Skills section', async ({ page }) => {
    const skillsSection = page.locator('.skills-section');
    await expect(skillsSection).toBeVisible();
    
    const skillsTitle = skillsSection.locator('h3');
    await expect(skillsTitle).toHaveText('Technical Skills');
  });

  test('should display skills grid with all expected skills', async ({ page }) => {
    const skillsGrid = page.locator('.skills-grid');
    await expect(skillsGrid).toBeVisible();
    
    const skillItems = page.locator('.skill-item');
    await expect(skillItems).toHaveCount(10);
    
    // Define expected skills
    const expectedSkills = [
      'JavaScript',
      'React',
      'Node.js',
      'Python',
      'AWS',
      'Spring Boot',
      'Docker',
      'Git',
      'SQL',
      'HTML/CSS'
    ];
    
    // Check each skill is displayed
    for (let i = 0; i < expectedSkills.length; i++) {
      await expect(skillItems.nth(i)).toHaveText(expectedSkills[i]);
    }
  });

  test('should have hover effects on skill items', async ({ page }) => {
    const skillItems = page.locator('.skill-item');
    
    // Test hover on first few skill items
    for (let i = 0; i < 3; i++) {
      const skillItem = skillItems.nth(i);
      
      // Hover over the skill item
      await skillItem.hover();
      
      // Should remain visible and interactive during hover
      await expect(skillItem).toBeVisible();
      
      // Move away to reset hover state
      await page.mouse.move(0, 0);
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 });
    
    // All main elements should still be visible and accessible
    await expect(page.locator('.about-me')).toBeVisible();
    await expect(page.locator('.section-title')).toBeVisible();
    await expect(page.locator('.about-content')).toBeVisible();
    await expect(page.locator('.about-text')).toBeVisible();
    await expect(page.locator('.skills-section')).toBeVisible();
    await expect(page.locator('.skills-grid')).toBeVisible();
    
    // Skills should wrap properly on mobile
    const skillItems = page.locator('.skill-item');
    await expect(skillItems).toHaveCount(10);
    
    // Check that skills are still readable
    await expect(skillItems.first()).toBeVisible();
    await expect(skillItems.last()).toBeVisible();
  });

  test('should be responsive on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check layout maintains proper structure on tablet
    await expect(page.locator('.about-me')).toBeVisible();
    await expect(page.locator('.about-content')).toBeVisible();
    
    // About details should be properly spaced
    const aboutItems = page.locator('.about-item');
    await expect(aboutItems).toHaveCount(3);
    
    // Skills grid should work well on tablet
    const skillsGrid = page.locator('.skills-grid');
    await expect(skillsGrid).toBeVisible();
    
    const skillItems = page.locator('.skill-item');
    await expect(skillItems).toHaveCount(10);
  });

  test('should be accessible for screen readers', async ({ page }) => {
    // Check that main section has proper ID for navigation
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();
    
    // Check headings hierarchy
    const h2 = page.locator('.about-me h2');
    await expect(h2).toHaveCount(1);
    await expect(h2).toHaveText('About Me');
    
    const h3Elements = page.locator('.about-me h3');
    await expect(h3Elements).toHaveCount(4); // Background, Philosophy, Interests, Technical Skills
    
    // Check that text content is properly structured
    const paragraphs = page.locator('.about-me p');
    expect(await paragraphs.count()).toBeGreaterThan(0);
  });

  test('should scroll into view when navigated to', async ({ page }) => {
    // Navigate to About Me section from header
    await page.click('button.nav-link:has-text("About Me")');
    
    // Wait for smooth scrolling
    await page.waitForTimeout(1000);
    
    // About Me section should be in view
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();
    
    const aboutBox = await aboutSection.boundingBox();
    expect(aboutBox.y).toBeLessThan(100);
  });

  test('should have proper spacing and layout', async ({ page }) => {
    const aboutContent = page.locator('.about-content');
    await expect(aboutContent).toBeVisible();
    
    // Check that there's proper spacing between text and skills
    const aboutText = page.locator('.about-text');
    const skillsSection = page.locator('.skills-section');
    
    await expect(aboutText).toBeVisible();
    await expect(skillsSection).toBeVisible();
    
    const textBox = await aboutText.boundingBox();
    const skillsBox = await skillsSection.boundingBox();
    
    // Skills section should be positioned below text section
    expect(skillsBox.y).toBeGreaterThan(textBox.y + textBox.height);
  });

  test('should maintain readability with proper typography', async ({ page }) => {
    // Check that text elements are readable
    const aboutIntro = page.locator('.about-intro');
    await expect(aboutIntro).toBeVisible();
    
    // Check about item headings
    const aboutItemHeadings = page.locator('.about-item h3');
    await expect(aboutItemHeadings).toHaveCount(3);
    
    for (let i = 0; i < 3; i++) {
      await expect(aboutItemHeadings.nth(i)).toBeVisible();
    }
    
    // Check skills title
    const skillsTitle = page.locator('.skills-section h3');
    await expect(skillsTitle).toBeVisible();
    await expect(skillsTitle).toHaveText('Technical Skills');
  });
});