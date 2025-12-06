import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Founder {
  name: string;
  role: string;
  description: string;
  avatar: string;
  gradientClass: string;
  roleColor: string;
  socialLinks: {
    website: string;
    facebook: string;
    linkedin: string;
  };
}

@Component({
  selector: 'app-founders',
  imports: [CommonModule],
  template: `
    <section class="founders">
      <div class="container">
        <div class="section-header">
          <h2>Meet The Founders</h2>
          <p>Passionate developers dedicated to helping you succeed</p>
        </div>
        <div class="founders-grid">
          <div *ngFor="let founder of founders" class="founder-card fade-in-up">
            <div class="founder-avatar" [ngClass]="founder.gradientClass">
              {{ founder.avatar }}
            </div>
            <h3>{{ founder.name }}</h3>
            <p class="founder-role" [style.color]="founder.roleColor">
              {{ founder.role }}
            </p>
            <p class="founder-description">{{ founder.description }}</p>
            <div class="social-links">
              <a
                [href]="founder.socialLinks.website"
                target="_blank"
                rel="noopener"
                title="Website"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path
                    d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                  ></path>
                </svg>
              </a>
              <a
                [href]="founder.socialLinks.facebook"
                target="_blank"
                rel="noopener"
                title="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </a>
              <a
                [href]="founder.socialLinks.linkedin"
                target="_blank"
                rel="noopener"
                title="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="mission-quote">
          <p>
            "We built DevDude because we believe every developer deserves access
            to high-quality assessments that truly measure their skills. Our
            mission is to help you identify your strengths, discover growth
            areas, and accelerate your career journey."
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .founders {
        padding: 6rem 2rem;
      }

      .container {
        max-width: 1200px;
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

      .founders-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 3rem;
        margin-top: 3rem;
      }

      .founder-card {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        padding: 2.5rem;
        text-align: center;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .founder-card::before {
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

      .founder-card:hover {
        transform: translateY(-5px);
        border-color: rgba(102, 126, 234, 0.5);
        box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
      }

      .founder-card:hover::before {
        transform: scaleX(1);
      }

      .founder-avatar {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin: 0 auto 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
      }

      .founder-avatar.gradient-purple {
        background: var(--primary-gradient);
        box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
      }

      .founder-avatar.gradient-blue {
        background: var(--primary-gradient);
        box-shadow: 0 10px 40px rgba(58, 65, 197, 0.3);
      }

      .founder-card h3 {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
        font-weight: 700;
      }

      .founder-role {
        font-weight: 600;
        margin-bottom: 1rem;
      }

      .founder-description {
        color: var(--text-secondary);
        line-height: 1.8;
        margin-bottom: 1.5rem;
      }

      .social-links {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1.5rem;
      }

      .social-links a {
        color: var(--text-secondary);
        font-size: 1.5rem;
        transition: color 0.3s, transform 0.3s;
        text-decoration: none;
      }

      .social-links a:hover {
        color: var(--text-primary);
        transform: translateY(-2px);
      }

      .mission-quote {
        text-align: center;
        margin-top: 4rem;
        padding: 2.5rem;
        background: rgba(102, 126, 234, 0.05);
        border-radius: 20px;
      }

      .mission-quote p {
        font-size: 1.25rem;
        font-style: italic;
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
        .founders-grid {
          grid-template-columns: 1fr;
        }

        .section-header h2 {
          font-size: 2rem;
        }
      }
    `,
  ],
})
export class FoundersComponent {
  founders: Founder[] = [
    {
      name: 'Phú Trần',
      role: 'Software Engineer @EPAM',
      description:
        'Software Engineer at EPAM with 5+ years of experience. Passionate about creating tools that help developers reach their full potential. Specializes in full-stack JavaScript and system architecture.',
      avatar: '👨‍💻',
      gradientClass: 'gradient-purple',
      roleColor: '#667eea',
      socialLinks: {
        website: '#',
        facebook: 'https://web.facebook.com/tr.minhphu',
        linkedin: 'https://www.linkedin.com/in/tmp-dev79/',
      },
    },
    {
      name: 'Khôi Trần',
      role: 'Software Engineer @Ovian',
      description:
        'With 4+ years of experience working as Software Engineer at Ovian, I have a deep understanding of the latest technologies and best practices. I am passionate about helping others learn and grow in their careers.',
      avatar: '👨‍💻',
      gradientClass: 'gradient-blue',
      roleColor: '#5d88c4',
      socialLinks: {
        website: '/',

        facebook: 'https://web.facebook.com/tranxyz88',
        linkedin: 'https://www.linkedin.com/in/tdkhoi253/',
      },
    },
  ];
}
