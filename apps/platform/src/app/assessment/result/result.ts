import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface CategoryScore {
  category: string;
  score: number;
  total: number;
  percentage: number;
}

@Component({
  selector: 'app-result',
  imports: [CommonModule, RouterLink],
  templateUrl: './result.html',
  styleUrl: './result.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ResultComponent implements OnInit, AfterViewInit {
  @ViewChild('radarChart') radarChartRef!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  // Simulated result data
  totalScore = 75;
  level = '';
  categoryScores: CategoryScore[] = [
    { category: 'Fundamental', score: 8, total: 10, percentage: 80 },
    { category: 'Framework', score: 7, total: 10, percentage: 70 },
    { category: 'State Management', score: 6, total: 10, percentage: 60 },
    { category: 'Security', score: 9, total: 10, percentage: 90 },
  ];

  stats = {
    totalQuestions: 40,
    correctAnswers: 30,
    timeTaken: '25:30',
    accuracy: 75,
  };

  ngOnInit() {
    this.calculateLevel();
  }

  ngAfterViewInit() {
    this.createRadarChart();
  }

  calculateLevel() {
    if (this.totalScore < 30) {
      this.level = 'Early Junior';
    } else if (this.totalScore >= 30 && this.totalScore < 55) {
      this.level = 'Junior';
    } else if (this.totalScore >= 55 && this.totalScore < 71) {
      this.level = 'Mid';
    } else if (this.totalScore >= 71 && this.totalScore < 80) {
      this.level = 'Mid Late';
    } else {
      this.level = 'Senior';
    }
  }

  createRadarChart() {
    if (!this.radarChartRef) return;

    const ctx = this.radarChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'radar'> = {
      type: 'radar',
      data: {
        labels: this.categoryScores.map((c) => c.category),
        datasets: [
          {
            label: 'Your Score',
            data: this.categoryScores.map((c) => c.percentage),
            fill: true,
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            borderColor: 'rgb(102, 126, 234)',
            pointBackgroundColor: 'rgb(102, 126, 234)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(102, 126, 234)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              color: '#a0aec0',
              backdropColor: 'transparent',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            pointLabels: {
              color: '#ffffff',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                return `Score: ${context.parsed.r}%`;
              },
            },
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  getLevelColor(): string {
    switch (this.level) {
      case 'Early Junior':
        return '#ef4444';
      case 'Junior':
        return '#f59e0b';
      case 'Mid':
        return '#3b82f6';
      case 'Mid Late':
        return '#8b5cf6';
      case 'Senior':
        return '#10b981';
      default:
        return '#667eea';
    }
  }

  getLevelIcon(): string {
    switch (this.level) {
      case 'Early Junior':
        return '🌱';
      case 'Junior':
        return '🌿';
      case 'Mid':
        return '🌳';
      case 'Mid Late':
        return '🏆';
      case 'Senior':
        return '👑';
      default:
        return '⭐';
    }
  }
}
