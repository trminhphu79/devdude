import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CommunityFeature {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

@Component({
  selector: 'app-community',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="community">
      <div class="container">
        <div class="section-header">
          <h2>Join The JavaScript Dude Community 🚀</h2>
          <p>Connect with thousands of developers leveling up their skills</p>
        </div>
        <div class="community-grid">
          <div
            *ngFor="let item of communityFeatures"
            class="feature-card fade-in-up"
          >
            <div class="feature-icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <div class="card-action">
              <a [routerLink]="item.buttonLink" class="btn-secondary">{{
                item.buttonText
              }}</a>
            </div>
          </div>
        </div>
        <div class="cta-card">
          <h3>Ready to Level Up?</h3>
          <p>
            Join 10,000+ developers who are mastering JavaScript and building
            amazing careers
          </p>
          <a routerLink="/assessment" class="btn-primary"
            >Start Your First Assessment</a
          >
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .community {
        padding: 6rem 2rem;
        background: linear-gradient(
          180deg,
          rgba(102, 126, 234, 0.05) 0%,
          transparent 100%
        );
      }

      .container {
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

      .community-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
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

      .card-action {
        margin-top: 1.5rem;
      }

      .btn-secondary {
        background: transparent;
        color: white;
        padding: 0.75rem 2rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        border: 2px solid rgba(255, 255, 255, 0.2);
        display: inline-block;
      }

      .btn-secondary:hover {
        border-color: rgba(255, 255, 255, 0.4);
        background: rgba(255, 255, 255, 0.05);
      }

      .cta-card {
        text-align: center;
        margin-top: 4rem;
        padding: 3rem;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 20px;
      }

      .cta-card h3 {
        font-size: 2rem;
        margin-bottom: 1rem;
      }

      .cta-card p {
        color: var(--text-secondary);
        font-size: 1.125rem;
        margin-bottom: 2rem;
      }

      .btn-primary {
        background: var(--primary-gradient);
        color: white;
        padding: 0.75rem 2rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        display: inline-block;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
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
        .community-grid {
          grid-template-columns: 1fr;
        }

        .section-header h2 {
          font-size: 2rem;
        }
      }
    `,
  ],
})
export class CommunityComponent {
  communityFeatures: CommunityFeature[] = [
    {
      icon: '💬',
      title: 'Active Discussions',
      description:
        'Join daily discussions on JavaScript, React, Node.js, and everything web development. Share your knowledge and learn from experienced developers.',
      buttonText: 'Join Discord',
      buttonLink: '#',
    },
    {
      icon: '📚',
      title: 'Learning Resources',
      description:
        'Access exclusive tutorials, code challenges, and study guides created by the community. From beginner to advanced topics.',
      buttonText: 'Browse Resources',
      buttonLink: '#',
    },
    {
      icon: '🎯',
      title: 'Weekly Challenges',
      description:
        'Participate in weekly coding challenges, compete on leaderboards, and win recognition. Perfect for interview prep and skill building.',
      buttonText: 'View Challenges',
      buttonLink: '#',
    },
  ];
}
