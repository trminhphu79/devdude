import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features',
  imports: [CommonModule],
  template: `
    <section class="features">
      <div class="section-header">
        <h2>Your Journey To Excellence</h2>
        <p>Comprehensive assessment platform designed for real-world skills</p>
      </div>
      <div class="features-grid">
        <div *ngFor="let feature of features" class="feature-card fade-in-up">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .features {
        padding: 6rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .section-header {
        text-align: center;
        margin-bottom: 4rem;
      }

      .section-header h2 {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 1rem;
      }

      .section-header p {
        font-size: 1.25rem;
        color: var(--text-secondary);
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
      }

      .feature-card {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        padding: 2.5rem;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .feature-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: var(--primary-gradient);
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      .feature-card:hover {
        transform: translateY(-5px);
        border-color: rgba(102, 126, 234, 0.5);
        box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
      }

      .feature-card:hover::before {
        transform: scaleX(1);
      }

      .feature-icon {
        width: 60px;
        height: 60px;
        background: var(--primary-gradient);
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
        margin-bottom: 1.5rem;
      }

      .feature-card h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        font-weight: 700;
      }

      .feature-card p {
        color: var(--text-secondary);
        line-height: 1.8;
      }

      .fade-in-up {
        animation: fadeInUp 0.6s ease-out;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 768px) {
        .features-grid {
          grid-template-columns: 1fr;
        }

        .section-header h2 {
          font-size: 2rem;
        }
      }
    `,
  ],
})
export class FeaturesComponent {
  features: Feature[] = [
    {
      icon: '🎯',
      title: 'Adaptive Difficulty',
      description:
        "Our intelligent system adjusts question difficulty based on your performance, ensuring you're always challenged at the right level.",
    },
    {
      icon: '📊',
      title: 'Detailed Analytics',
      description:
        'Get comprehensive insights into your performance with detailed breakdowns by topic, difficulty level, and skill areas.',
    },
    {
      icon: '🚀',
      title: 'Real-World Scenarios',
      description:
        'Practice with questions based on actual interview problems and real-world coding challenges from top tech companies.',
    },
    {
      icon: '💡',
      title: 'Instant Feedback',
      description:
        "Learn from detailed explanations for every question. Understand not just what's correct, but why it's the best solution.",
    },
    {
      icon: '🏆',
      title: 'Level Certification',
      description:
        'Earn recognized certifications that validate your skills from Fresher to Senior level, backed by comprehensive assessments.',
    },
    {
      icon: '⏱️',
      title: 'Timed Challenges',
      description:
        'Simulate real interview conditions with timed assessments that help you build speed and confidence under pressure.',
    },
  ];
}
