import { test, expect } from '@playwright/test';

test.describe('Projects Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display Projects section with proper structure', async ({ page }) => {
    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeVisible();
    await expect(projectsSection).toHaveClass(/projects/);
    
    const container = projectsSection.locator('.container');
    await expect(container).toBeVisible();
  });

  test('should display section header with title and subtitle', async ({ page }) => {
    const sectionHeader = page.locator('.projects .section-header');
    await expect(sectionHeader).toBeVisible();
    
    const sectionTitle = page.locator('.projects .section-title');
    await expect(sectionTitle).toBeVisible();
    await expect(sectionTitle).toHaveText('Featured Projects');
    
    const sectionSubtitle = page.locator('.projects .section-subtitle');
    await expect(sectionSubtitle).toBeVisible();
    await expect(sectionSubtitle).toContainText('collection of recent work');
    await expect(sectionSubtitle).toContainText('web development');
    
    const sectionDivider = page.locator('.projects .section-divider');
    await expect(sectionDivider).toBeVisible();
  });

  test('should display projects in grid layout', async ({ page }) => {
    const projectsGrid = page.locator('.projects-grid');
    await expect(projectsGrid).toBeVisible();
    
    const projectCards = page.locator('.project-card');
    await expect(projectCards).toHaveCount(6);
  });

  test('should display all project cards with proper structure', async ({ page }) => {
    const projectCards = page.locator('.project-card');
    
    for (let i = 0; i < 6; i++) {
      const card = projectCards.nth(i);
      await expect(card).toBeVisible();
      
      // Check project image/placeholder
      const projectImage = card.locator('.project-image');
      await expect(projectImage).toBeVisible();
      
      // Check project content
      const projectContent = card.locator('.project-content');
      await expect(projectContent).toBeVisible();
      
      // Check project title
      const projectTitle = card.locator('.project-title');
      await expect(projectTitle).toBeVisible();
      
      // Check project description
      const projectDescription = card.locator('.project-description');
      await expect(projectDescription).toBeVisible();
      
      // Check technologies section
      const projectTechnologies = card.locator('.project-technologies');
      await expect(projectTechnologies).toBeVisible();
      
      // Check project links
      const projectLinks = card.locator('.project-links');
      await expect(projectLinks).toBeVisible();
    }
  });

  test('should display expected project titles', async ({ page }) => {
    const projectTitles = page.locator('.project-title');
    
    const expectedTitles = [
      'Personal Portfolio Website',
      'E-Commerce Platform',
      'Task Management App',
      'Weather Dashboard',
      'API Gateway Service',
      'Data Analytics Platform'
    ];
    
    await expect(projectTitles).toHaveCount(6);
    
    for (let i = 0; i < expectedTitles.length; i++) {
      await expect(projectTitles.nth(i)).toHaveText(expectedTitles[i]);
    }
  });

  test('should display project descriptions', async ({ page }) => {
    const projectCards = page.locator('.project-card');
    
    // Test first project description
    const firstDescription = projectCards.nth(0).locator('.project-description');
    await expect(firstDescription).toContainText('modern, responsive portfolio website');
    await expect(firstDescription).toContainText('React and AWS serverless');
    
    // Test second project description
    const secondDescription = projectCards.nth(1).locator('.project-description');
    await expect(secondDescription).toContainText('Full-stack e-commerce application');
    await expect(secondDescription).toContainText('user authentication');
  });

  test('should display technology tags for each project', async ({ page }) => {
    const projectCards = page.locator('.project-card');
    
    // Test first project technologies
    const firstTechTags = projectCards.nth(0).locator('.tech-tag');
    await expect(firstTechTags).toHaveCount(4);
    await expect(firstTechTags.nth(0)).toHaveText('React');
    await expect(firstTechTags.nth(1)).toHaveText('AWS Lambda');
    await expect(firstTechTags.nth(2)).toHaveText('DynamoDB');
    await expect(firstTechTags.nth(3)).toHaveText('Vite');
    
    // Test second project technologies
    const secondTechTags = projectCards.nth(1).locator('.tech-tag');
    await expect(secondTechTags).toHaveCount(4);
    await expect(secondTechTags.nth(0)).toHaveText('React');
    await expect(secondTechTags.nth(1)).toHaveText('Node.js');
    await expect(secondTechTags.nth(2)).toHaveText('MongoDB');
    await expect(secondTechTags.nth(3)).toHaveText('Stripe API');
  });

  test('should display project placeholders when no images are provided', async ({ page }) => {
    const projectCards = page.locator('.project-card');
    
    for (let i = 0; i < 6; i++) {
      const card = projectCards.nth(i);
      const placeholder = card.locator('.project-placeholder');
      await expect(placeholder).toBeVisible();
      
      // Check placeholder SVG
      const placeholderSvg = placeholder.locator('svg');
      await expect(placeholderSvg).toBeVisible();
    }
  });

  test('should display GitHub links for all projects', async ({ page }) => {
    const projectCards = page.locator('.project-card');
    
    for (let i = 0; i < 6; i++) {
      const card = projectCards.nth(i);
      const githubLink = card.locator('.project-link:has-text("Code")');
      await expect(githubLink).toBeVisible();
      await expect(githubLink).toHaveAttribute('target', '_blank');
      await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('should display Live Demo links for projects that have them', async ({ page }) => {
    const projectCards = page.locator('.project-card');
    
    // Projects 1-4 and 6 should have live demo links (project 5 doesn't)
    const projectsWithLiveDemo = [0, 1, 2, 3, 5]; // indices
    
    for (const index of projectsWithLiveDemo) {
      const card = projectCards.nth(index);
      const liveDemoLink = card.locator('.project-link:has-text("Live Demo")');
      await expect(liveDemoLink).toBeVisible();
      await expect(liveDemoLink).toHaveClass(/project-link-primary/);
    }
    
    // Project 5 (API Gateway Service) should not have a live demo link
    const fifthProject = projectCards.nth(4);
    const fifthProjectLiveDemo = fifthProject.locator('.project-link:has-text("Live Demo")');
    await expect(fifthProjectLiveDemo).toHaveCount(0);
  });

  test('should have hover effects on project cards', async ({ page }) => {
    const projectCards = page.locator('.project-card');
    
    // Test hover on first few project cards
    for (let i = 0; i < 3; i++) {
      const card = projectCards.nth(i);
      
      // Hover over the card
      await card.hover();
      
      // Card should remain visible and interactive
      await expect(card).toBeVisible();
      
      // Check that links are still clickable during hover
      const githubLink = card.locator('.project-link:has-text("Code")');
      await expect(githubLink).toBeVisible();
      
      // Move away to reset hover state
      await page.mouse.move(0, 0);
    }
  });

  test('should have working hover effects on technology tags', async ({ page }) => {
    const techTags = page.locator('.tech-tag');
    
    // Test hover on first few tech tags
    for (let i = 0; i < 5; i++) {
      const tag = techTags.nth(i);
      await tag.hover();
      await expect(tag).toBeVisible();
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 });
    
    // Projects section should still be visible
    await expect(page.locator('.projects')).toBeVisible();
    await expect(page.locator('.section-title')).toBeVisible();
    
    // Projects grid should adapt to mobile
    const projectsGrid = page.locator('.projects-grid');
    await expect(projectsGrid).toBeVisible();
    
    // All project cards should still be accessible
    const projectCards = page.locator('.project-card');
    await expect(projectCards).toHaveCount(6);
    
    // Cards should be stacked vertically on mobile
    for (let i = 0; i < 3; i++) {
      await expect(projectCards.nth(i)).toBeVisible();
    }
  });

  test('should be responsive on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check that projects maintain good layout on tablet
    const projectsGrid = page.locator('.projects-grid');
    await expect(projectsGrid).toBeVisible();
    
    const projectCards = page.locator('.project-card');
    await expect(projectCards).toHaveCount(6);
    
    // Check that technology tags wrap properly
    const techTags = page.locator('.tech-tag');
    expect(await techTags.count()).toBeGreaterThan(0);
  });

  test('should scroll into view when navigated to', async ({ page }) => {
    // Navigate to Projects section from header
    await page.click('button.nav-link:has-text("Projects")');
    
    // Wait for smooth scrolling
    await page.waitForTimeout(1000);
    
    // Projects section should be in view
    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeVisible();
    
    const projectsBox = await projectsSection.boundingBox();
    expect(projectsBox.y).toBeLessThan(100);
  });

  test('should navigate to Projects section from hero button', async ({ page }) => {
    // Click See Projects button in hero section
    await page.click('.btn.btn-secondary:has-text("See Projects")');
    
    await page.waitForTimeout(1000);
    
    // Should scroll to projects section
    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeVisible();
    
    const projectsBox = await projectsSection.boundingBox();
    expect(projectsBox.y).toBeLessThan(100);
  });

  test('should have accessible project links', async ({ page }) => {
    const projectLinks = page.locator('.project-link');
    
    // All project links should be focusable
    for (let i = 0; i < 5; i++) {
      const link = projectLinks.nth(i);
      await link.focus();
      await expect(link).toBeFocused();
    }
  });

  test('should maintain proper spacing in project grid', async ({ page }) => {
    const projectsGrid = page.locator('.projects-grid');
    await expect(projectsGrid).toBeVisible();
    
    const projectCards = page.locator('.project-card');
    
    // Check that all cards have proper spacing
    for (let i = 0; i < 3; i++) {
      const card = projectCards.nth(i);
      await expect(card).toBeVisible();
      
      const cardBox = await card.boundingBox();
      expect(cardBox.width).toBeGreaterThan(200); // Reasonable minimum width
      expect(cardBox.height).toBeGreaterThan(300); // Reasonable minimum height
    }
  });

  test('should display proper content hierarchy', async ({ page }) => {
    const projectCards = page.locator('.project-card');
    const firstCard = projectCards.nth(0);
    
    // Check content hierarchy within a project card
    const projectTitle = firstCard.locator('.project-title');
    const projectDescription = firstCard.locator('.project-description');
    const projectTechnologies = firstCard.locator('.project-technologies');
    const projectLinks = firstCard.locator('.project-links');
    
    await expect(projectTitle).toBeVisible();
    await expect(projectDescription).toBeVisible();
    await expect(projectTechnologies).toBeVisible();
    await expect(projectLinks).toBeVisible();
    
    // Check that elements are in correct order
    const titleBox = await projectTitle.boundingBox();
    const descriptionBox = await projectDescription.boundingBox();
    const technologiesBox = await projectTechnologies.boundingBox();
    const linksBox = await projectLinks.boundingBox();
    
    expect(descriptionBox.y).toBeGreaterThan(titleBox.y);
    expect(technologiesBox.y).toBeGreaterThan(descriptionBox.y);
    expect(linksBox.y).toBeGreaterThan(technologiesBox.y);
  });
});