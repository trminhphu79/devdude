import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { OverviewComponent } from './overview.ts';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Guide Steps', () => {
    it('should have 4 guide steps', () => {
      expect(component.guideSteps).toBeDefined();
      expect(component.guideSteps.length).toBe(4);
    });

    it('should have correct guide step structure', () => {
      const firstStep = component.guideSteps[0];
      expect(firstStep).toHaveProperty('icon');
      expect(firstStep).toHaveProperty('title');
      expect(firstStep).toHaveProperty('description');
    });

    it('should have "Choose Your Topic" as first step', () => {
      expect(component.guideSteps[0].title).toBe('Choose Your Topic');
    });

    it('should have "Take the Assessment" as second step', () => {
      expect(component.guideSteps[1].title).toBe('Take the Assessment');
    });

    it('should have "Get Instant Results" as third step', () => {
      expect(component.guideSteps[2].title).toBe('Get Instant Results');
    });

    it('should have "Track Your Progress" as fourth step', () => {
      expect(component.guideSteps[3].title).toBe('Track Your Progress');
    });

    it('should have icons for all steps', () => {
      component.guideSteps.forEach((step) => {
        expect(step.icon).toBeTruthy();
        expect(typeof step.icon).toBe('string');
      });
    });

    it('should have descriptions for all steps', () => {
      component.guideSteps.forEach((step) => {
        expect(step.description).toBeTruthy();
        expect(step.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Assessment Features', () => {
    it('should have 4 features', () => {
      expect(component.features).toBeDefined();
      expect(component.features.length).toBe(4);
    });

    it('should have correct feature structure', () => {
      const firstFeature = component.features[0];
      expect(firstFeature).toHaveProperty('icon');
      expect(firstFeature).toHaveProperty('title');
      expect(firstFeature).toHaveProperty('description');
    });

    it('should include "Accurate Skill Assessment" feature', () => {
      const feature = component.features.find(
        (f) => f.title === 'Accurate Skill Assessment'
      );
      expect(feature).toBeDefined();
      expect(feature?.description).toContain('algorithm');
    });

    it('should include "Honest Results" feature', () => {
      const feature = component.features.find(
        (f) => f.title === 'Honest Results'
      );
      expect(feature).toBeDefined();
      expect(feature?.description).toContain('truthful');
    });

    it('should include "Retake Anytime" feature', () => {
      const feature = component.features.find(
        (f) => f.title === 'Retake Anytime'
      );
      expect(feature).toBeDefined();
      expect(feature?.description).toContain('retake');
    });

    it('should include "Earn Certifications" feature', () => {
      const feature = component.features.find(
        (f) => f.title === 'Earn Certifications'
      );
      expect(feature).toBeDefined();
      expect(feature?.description).toContain('certifications');
    });

    it('should have icons for all features', () => {
      component.features.forEach((feature) => {
        expect(feature.icon).toBeTruthy();
        expect(typeof feature.icon).toBe('string');
      });
    });
  });

  describe('Topics (Simulated Backend Data)', () => {
    it('should have 3 topics', () => {
      expect(component.topics).toBeDefined();
      expect(component.topics.length).toBe(3);
    });

    it('should have correct topic structure', () => {
      const firstTopic = component.topics[0];
      expect(firstTopic).toHaveProperty('id');
      expect(firstTopic).toHaveProperty('name');
      expect(firstTopic).toHaveProperty('icon');
      expect(firstTopic).toHaveProperty('category');
      expect(firstTopic).toHaveProperty('totalQuestions');
      expect(firstTopic).toHaveProperty('durationMinutes');
      expect(firstTopic).toHaveProperty('description');
    });

    it('should include Angular topic', () => {
      const angular = component.topics.find((t) => t.id === 'angular');
      expect(angular).toBeDefined();
      expect(angular?.name).toBe('Frontend - Angular');
      expect(angular?.category).toBe('Frontend');
      expect(angular?.totalQuestions).toBe(45);
      expect(angular?.durationMinutes).toBe(60);
    });

    it('should include React topic', () => {
      const react = component.topics.find((t) => t.id === 'react');
      expect(react).toBeDefined();
      expect(react?.name).toBe('Frontend - ReactJS');
      expect(react?.category).toBe('Frontend');
      expect(react?.totalQuestions).toBe(50);
      expect(react?.durationMinutes).toBe(75);
    });

    it('should include Flutter topic', () => {
      const flutter = component.topics.find((t) => t.id === 'flutter');
      expect(flutter).toBeDefined();
      expect(flutter?.name).toBe('Mobile - Flutter');
      expect(flutter?.category).toBe('Mobile');
      expect(flutter?.totalQuestions).toBe(40);
      expect(flutter?.durationMinutes).toBe(60);
    });

    it('should have unique topic IDs', () => {
      const ids = component.topics.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid question counts', () => {
      component.topics.forEach((topic) => {
        expect(topic.totalQuestions).toBeGreaterThan(0);
        expect(topic.totalQuestions).toBeLessThan(200);
      });
    });

    it('should have valid duration times', () => {
      component.topics.forEach((topic) => {
        expect(topic.durationMinutes).toBeGreaterThan(0);
        expect(topic.durationMinutes).toBeLessThan(300);
      });
    });

    it('should have icons for all topics', () => {
      component.topics.forEach((topic) => {
        expect(topic.icon).toBeTruthy();
        expect(typeof topic.icon).toBe('string');
      });
    });

    it('should have descriptions for all topics', () => {
      component.topics.forEach((topic) => {
        expect(topic.description).toBeTruthy();
        expect(topic.description.length).toBeGreaterThan(20);
      });
    });
  });

  describe('Template Rendering', () => {
    it('should render hero title', () => {
      const compiled = fixture.nativeElement;
      const heroTitle = compiled.querySelector('.hero-title');
      expect(heroTitle).toBeTruthy();
      expect(heroTitle.textContent).toContain('Ready to Test Your Skills');
    });

    it('should render all guide steps', () => {
      const compiled = fixture.nativeElement;
      const guideCards = compiled.querySelectorAll('.guide-card');
      expect(guideCards.length).toBe(4);
    });

    it('should render step numbers', () => {
      const compiled = fixture.nativeElement;
      const stepNumbers = compiled.querySelectorAll('.step-number');
      expect(stepNumbers.length).toBe(4);
      expect(stepNumbers[0].textContent?.trim()).toBe('1');
      expect(stepNumbers[3].textContent?.trim()).toBe('4');
    });

    it('should render all features', () => {
      const compiled = fixture.nativeElement;
      const tipItems = compiled.querySelectorAll('.tip-item');
      expect(tipItems.length).toBe(4);
    });

    it('should render honesty section', () => {
      const compiled = fixture.nativeElement;
      const honestyCard = compiled.querySelector('.honesty-card');
      expect(honestyCard).toBeTruthy();
      expect(honestyCard.textContent).toContain('Be Honest');
    });

    it('should render benefits list', () => {
      const compiled = fixture.nativeElement;
      const benefitsList = compiled.querySelector('.benefits-list');
      expect(benefitsList).toBeTruthy();
      const listItems = benefitsList?.querySelectorAll('li');
      expect(listItems?.length).toBe(4);
    });

    it('should render topic buttons', () => {
      const compiled = fixture.nativeElement;
      const topicButtons = compiled.querySelectorAll('.topic-btn');
      expect(topicButtons.length).toBeGreaterThan(0);
    });

    it('should have router links on topic buttons', () => {
      const compiled = fixture.nativeElement;
      const topicButtons = compiled.querySelectorAll('.topic-btn');
      topicButtons.forEach((button: Element) => {
        expect(button.getAttribute('ng-reflect-router-link')).toBeTruthy();
      });
    });

    it('should render back to home button', () => {
      const compiled = fixture.nativeElement;
      const backButton = compiled.querySelector('.btn-secondary');
      expect(backButton).toBeTruthy();
      expect(backButton.textContent).toContain('Back to Home');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const compiled = fixture.nativeElement;
      const h1 = compiled.querySelector('h1');
      const h2s = compiled.querySelectorAll('h2');
      const h3s = compiled.querySelectorAll('h3');

      expect(h1).toBeTruthy();
      expect(h2s.length).toBeGreaterThan(0);
      expect(h3s.length).toBeGreaterThan(0);
    });

    it('should have descriptive button text', () => {
      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('button');
      buttons.forEach((button: Element) => {
        expect(button.textContent?.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Data Integrity', () => {
    it('should not have empty guide step titles', () => {
      component.guideSteps.forEach((step) => {
        expect(step.title.trim()).not.toBe('');
      });
    });

    it('should not have empty feature titles', () => {
      component.features.forEach((feature) => {
        expect(feature.title.trim()).not.toBe('');
      });
    });

    it('should have meaningful descriptions', () => {
      component.guideSteps.forEach((step) => {
        expect(step.description.length).toBeGreaterThan(20);
      });

      component.features.forEach((feature) => {
        expect(feature.description.length).toBeGreaterThan(20);
      });
    });
  });
});
