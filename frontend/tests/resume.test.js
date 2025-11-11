import { test, expect } from '@playwright/test';

test.describe('Resume Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display Resume section with proper structure', async ({ page }) => {
    const resumeSection = page.locator('#resume');
    await expect(resumeSection).toBeVisible();
    await expect(resumeSection).toHaveClass(/resume/);
    
    const container = resumeSection.locator('.container');
    await expect(container).toBeVisible();
  });

  test('should display section header with title and subtitle', async ({ page }) => {
    const sectionHeader = page.locator('.resume .section-header');
    await expect(sectionHeader).toBeVisible();
    
    const sectionTitle = page.locator('.resume .section-title');
    await expect(sectionTitle).toBeVisible();
    await expect(sectionTitle).toHaveText('Resume');
    
    const sectionSubtitle = page.locator('.resume .section-subtitle');
    await expect(sectionSubtitle).toBeVisible();
    await expect(sectionSubtitle).toHaveText('My professional journey and qualifications');
    
    const sectionDivider = page.locator('.resume .section-divider');
    await expect(sectionDivider).toBeVisible();
  });

  test('should display resume content with proper layout', async ({ page }) => {
    const resumeContent = page.locator('.resume-content');
    await expect(resumeContent).toBeVisible();
    
    // Check main timeline section
    const timelineSection = page.locator('.resume-section:has(.timeline)');
    await expect(timelineSection).toBeVisible();
    
    // Check sidebar
    const resumeSidebar = page.locator('.resume-sidebar');
    await expect(resumeSidebar).toBeVisible();
  });

  test('should display Experience section with timeline', async ({ page }) => {
    const experienceSection = page.locator('.resume-section:has(.timeline)');
    const experienceTitle = experienceSection.locator('.resume-section-title');
    await expect(experienceTitle).toHaveText('Experience');
    
    const timeline = page.locator('.timeline');
    await expect(timeline).toBeVisible();
    
    const timelineItems = page.locator('.timeline-item');
    await expect(timelineItems).toHaveCount(3);
  });

  test('should display all experience timeline items with correct content', async ({ page }) => {
    const timelineItems = page.locator('.timeline-item');
    
    // Test first experience (Senior Software Developer)
    const firstItem = timelineItems.nth(0);
    await expect(firstItem.locator('.timeline-title')).toHaveText('Senior Software Developer');
    await expect(firstItem.locator('.timeline-company')).toHaveText('Tech Innovations Inc.');
    await expect(firstItem.locator('.timeline-period')).toHaveText('2022 - Present');
    
    const firstDescriptionItems = firstItem.locator('.timeline-description li');
    await expect(firstDescriptionItems).toHaveCount(4);
    await expect(firstDescriptionItems.nth(0)).toContainText('Lead development of full-stack web applications');
    
    // Test second experience (Full Stack Developer)
    const secondItem = timelineItems.nth(1);
    await expect(secondItem.locator('.timeline-title')).toHaveText('Full Stack Developer');
    await expect(secondItem.locator('.timeline-company')).toHaveText('Digital Solutions LLC');
    await expect(secondItem.locator('.timeline-period')).toHaveText('2020 - 2022');
    
    // Test third experience (Junior Developer)
    const thirdItem = timelineItems.nth(2);
    await expect(thirdItem.locator('.timeline-title')).toHaveText('Junior Developer');
    await expect(thirdItem.locator('.timeline-company')).toHaveText('StartUp Ventures');
    await expect(thirdItem.locator('.timeline-period')).toHaveText('2019 - 2020');
  });

  test('should display timeline markers for each experience', async ({ page }) => {
    const timelineMarkers = page.locator('.timeline-marker');
    await expect(timelineMarkers).toHaveCount(3);
    
    for (let i = 0; i < 3; i++) {
      await expect(timelineMarkers.nth(i)).toBeVisible();
    }
  });

  test('should display Education section', async ({ page }) => {
    const educationSection = page.locator('.resume-sidebar .resume-section:has(.education-item)');
    await expect(educationSection).toBeVisible();
    
    const educationTitle = educationSection.locator('.resume-section-title');
    await expect(educationTitle).toHaveText('Education');
    
    const educationItem = page.locator('.education-item');
    await expect(educationItem).toHaveCount(1);
    
    // Check education content
    await expect(educationItem.locator('.education-degree')).toHaveText('Bachelor of Science in Computer Science');
    await expect(educationItem.locator('.education-school')).toHaveText('University of Technology');
    await expect(educationItem.locator('.education-period')).toHaveText('2015 - 2019');
    await expect(educationItem.locator('.education-description')).toContainText('Graduated Magna Cum Laude');
  });

  test('should display Certifications section', async ({ page }) => {
    const certificationsSection = page.locator('.resume-sidebar .resume-section:has(.certifications-list)');
    await expect(certificationsSection).toBeVisible();
    
    const certificationsTitle = certificationsSection.locator('.resume-section-title');
    await expect(certificationsTitle).toHaveText('Certifications');
    
    const certificationsList = page.locator('.certifications-list');
    await expect(certificationsList).toBeVisible();
    
    const certificationItems = page.locator('.certification-item');
    await expect(certificationItems).toHaveCount(4);
    
    // Check certification content
    const expectedCertifications = [
      'AWS Certified Solutions Architect',
      'React Developer Certification',
      'Agile Development Practitioner',
      'Google Cloud Platform Professional'
    ];
    
    for (let i = 0; i < expectedCertifications.length; i++) {
      await expect(certificationItems.nth(i)).toHaveText(expectedCertifications[i]);
    }
  });

  test('should display Download CV button', async ({ page }) => {
    const downloadButton = page.locator('.download-cv-btn');
    await expect(downloadButton).toBeVisible();
    await expect(downloadButton).toContainText('Download CV');
    
    // Check button has SVG icon
    const buttonSvg = downloadButton.locator('svg');
    await expect(buttonSvg).toBeVisible();
  });

  test('should show alert when Download CV button is clicked', async ({ page }) => {
    // Set up alert handler
    let alertMessage = '';
    page.on('dialog', dialog => {
      alertMessage = dialog.message();
      dialog.accept();
    });
    
    const downloadButton = page.locator('.download-cv-btn');
    await downloadButton.click();
    
    // Check that alert was shown with expected message
    expect(alertMessage).toBe('CV download functionality would be implemented here');
  });

  test('should scroll into view when navigated to from header', async ({ page }) => {
    // Navigate to Resume section from header
    await page.click('button.nav-link:has-text("Resume")');
    
    // Wait for smooth scrolling
    await page.waitForTimeout(1000);
    
    // Resume section should be in view
    const resumeSection = page.locator('#resume');
    await expect(resumeSection).toBeVisible();
    
    const resumeBox = await resumeSection.boundingBox();
    expect(resumeBox.y).toBeLessThan(100);
  });

  test('should scroll into view when navigated to from hero button', async ({ page }) => {
    // Click View Resume button in hero section
    await page.click('.btn.btn-primary:has-text("View Resume")');
    
    await page.waitForTimeout(1000);
    
    // Should scroll to resume section
    const resumeSection = page.locator('#resume');
    await expect(resumeSection).toBeVisible();
    
    const resumeBox = await resumeSection.boundingBox();
    expect(resumeBox.y).toBeLessThan(100);
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 });
    
    // Resume section should still be visible
    await expect(page.locator('.resume')).toBeVisible();
    await expect(page.locator('.section-title')).toBeVisible();
    
    // Resume content should adapt to mobile
    const resumeContent = page.locator('.resume-content');
    await expect(resumeContent).toBeVisible();
    
    // Timeline should still be visible and accessible
    const timeline = page.locator('.timeline');
    await expect(timeline).toBeVisible();
    
    const timelineItems = page.locator('.timeline-item');
    await expect(timelineItems).toHaveCount(3);
    
    // Sidebar content should still be accessible
    const resumeSidebar = page.locator('.resume-sidebar');
    await expect(resumeSidebar).toBeVisible();
    
    // Download button should be visible
    const downloadButton = page.locator('.download-cv-btn');
    await expect(downloadButton).toBeVisible();
  });

  test('should be responsive on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check that resume maintains good layout on tablet
    const resumeContent = page.locator('.resume-content');
    await expect(resumeContent).toBeVisible();
    
    const timeline = page.locator('.timeline');
    await expect(timeline).toBeVisible();
    
    const resumeSidebar = page.locator('.resume-sidebar');
    await expect(resumeSidebar).toBeVisible();
    
    // All timeline items should be properly displayed
    const timelineItems = page.locator('.timeline-item');
    await expect(timelineItems).toHaveCount(3);
  });

  test('should have proper content hierarchy', async ({ page }) => {
    // Check timeline items have proper structure
    const firstTimelineItem = page.locator('.timeline-item').nth(0);
    
    const timelineHeader = firstTimelineItem.locator('.timeline-header');
    const timelineDescription = firstTimelineItem.locator('.timeline-description');
    
    await expect(timelineHeader).toBeVisible();
    await expect(timelineDescription).toBeVisible();
    
    // Check that header comes before description
    const headerBox = await timelineHeader.boundingBox();
    const descriptionBox = await timelineDescription.boundingBox();
    
    expect(descriptionBox.y).toBeGreaterThan(headerBox.y);
  });

  test('should display detailed experience descriptions', async ({ page }) => {
    const timelineItems = page.locator('.timeline-item');
    
    // Check first experience has multiple description points
    const firstDescriptions = timelineItems.nth(0).locator('.timeline-description li');
    await expect(firstDescriptions).toHaveCount(4);
    
    // Check content of first description point
    await expect(firstDescriptions.nth(0)).toContainText('Lead development of full-stack web applications');
    await expect(firstDescriptions.nth(1)).toContainText('Architected and implemented microservices');
    await expect(firstDescriptions.nth(2)).toContainText('Mentored junior developers');
    await expect(firstDescriptions.nth(3)).toContainText('Reduced deployment time by 60%');
  });

  test('should have accessible download button', async ({ page }) => {
    const downloadButton = page.locator('.download-cv-btn');
    
    // Button should be focusable
    await downloadButton.focus();
    await expect(downloadButton).toBeFocused();
    
    // Should be clickable with keyboard
    await downloadButton.press('Enter');
    
    // Should trigger the same alert
    await page.waitForTimeout(100);
  });

  test('should maintain proper spacing in timeline', async ({ page }) => {
    const timelineItems = page.locator('.timeline-item');
    
    // Check that timeline items have reasonable spacing
    for (let i = 0; i < 3; i++) {
      const item = timelineItems.nth(i);
      await expect(item).toBeVisible();
      
      const itemBox = await item.boundingBox();
      expect(itemBox.height).toBeGreaterThan(100); // Reasonable minimum height
    }
  });

  test('should display proper chronological order', async ({ page }) => {
    const timelinePeriods = page.locator('.timeline-period');
    
    // Check periods are in correct order (newest first)
    await expect(timelinePeriods.nth(0)).toHaveText('2022 - Present');
    await expect(timelinePeriods.nth(1)).toHaveText('2020 - 2022');
    await expect(timelinePeriods.nth(2)).toHaveText('2019 - 2020');
  });
});