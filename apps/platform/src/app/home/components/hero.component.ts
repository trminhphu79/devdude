import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-content fade-in-up">
        <h1 class="hero-title">Master Your Skills Through Assessment</h1>
        <p class="hero-description">
          Take comprehensive technical assessments and discover your true level.
          From Junior to Senior, we help you identify gaps and accelerate your
          growth.
        </p>
        <div class="hero-cta">
          <a routerLink="/assessment" class="btn-primary">
            👉 Take Free Assessment
          </a>
          <a routerLink="/assessment/sample-question" class="btn-secondary"
            >View Sample Questions</a
          >
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        margin-top: 80px;
        padding: 8rem 2rem 6rem;
        text-align: center;
        position: relative;
        overflow: hidden;
      }

      .hero::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
          circle,
          rgba(102, 126, 234, 0.1) 0%,
          transparent 70%
        );
        animation: pulse 15s ease-in-out infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 0.5;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.8;
        }
      }

      .hero-content {
        max-width: 900px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
      }

      .hero-title {
        font-size: 4.5rem;
        font-weight: 900;
        line-height: 1.1;
        margin-bottom: 1.5rem;
        background: linear-gradient(135deg, #ffffff 0%, #667eea 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .hero-description {
        font-size: 1.5rem;
        color: var(--text-secondary);
        margin-bottom: 3rem;
        font-weight: 300;
      }

      .hero-cta {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
        align-items: center;
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
        .hero-title {
          font-size: 2.5rem;
        }

        .hero-description {
          font-size: 1.125rem;
        }

        .hero-cta {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class HeroComponent {}
