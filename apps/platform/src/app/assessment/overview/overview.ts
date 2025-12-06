import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface GuideStep {
  icon: string;
  title: string;
  description: string;
}

interface AssessmentFeature {
  icon: string;
  title: string;
  description: string;
}

interface Topic {
  id: string;
  name: string;
  icon: string;
  category: string;
  totalQuestions: number;
  durationMinutes: number;
  description: string;
}

@Component({
  selector: 'app-assessment-overview',
  imports: [RouterModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class OverviewComponent {
  topics: Topic[] = [
    {
      id: 'angular',
      name: 'Frontend - Angular',
      icon: '🅰️',
      category: 'Frontend',
      totalQuestions: 45,
      durationMinutes: 60,
      description:
        'Test your Angular knowledge including components, services, RxJS, and best practices.',
    },
    {
      id: 'react',
      name: 'Frontend - ReactJS',
      icon: '⚛️',
      category: 'Frontend',
      totalQuestions: 50,
      durationMinutes: 75,
      description:
        'Assess your React skills including hooks, state management, and component architecture.',
    },
    {
      id: 'flutter',
      name: 'Mobile - Flutter',
      icon: '📱',
      category: 'Mobile',
      totalQuestions: 40,
      durationMinutes: 60,
      description:
        'Evaluate your Flutter expertise including widgets, state management, and mobile development.',
    },
  ];

  guideSteps: GuideStep[] = [
    {
      icon: '📝',
      title: 'Choose Your Topic',
      description:
        'Select from our comprehensive library of technical topics that match your interests and career goals.',
    },
    {
      icon: '⏱️',
      title: 'Take the Assessment',
      description:
        'Answer questions at your own pace. Each question is timed to simulate real interview conditions.',
    },
    {
      icon: '📊',
      title: 'Get Instant Results',
      description:
        'Receive detailed feedback on your performance, including your skill level and areas for improvement.',
    },
    {
      icon: '🎯',
      title: 'Track Your Progress',
      description:
        'Monitor your growth over time and see how you compare to other developers in the community.',
    },
  ];

  features: AssessmentFeature[] = [
    {
      icon: '🎓',
      title: 'Accurate Skill Assessment',
      description:
        'Our algorithm evaluates your answers to provide an accurate representation of your current skill level.',
    },
    {
      icon: '💯',
      title: 'Honest Results',
      description:
        'Be truthful in your answers - the assessment works best when you answer based on your actual knowledge.',
    },
    {
      icon: '🔄',
      title: 'Retake Anytime',
      description:
        'You can retake assessments to track your improvement and validate your learning progress.',
    },
    {
      icon: '🏆',
      title: 'Earn Certifications',
      description:
        'Achieve high scores to earn recognized certifications that validate your expertise.',
    },
  ];
}
