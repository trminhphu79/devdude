import {
  ChangeDetectionStrategy,
  Component,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Answer {
  questionId: number;
  selectedOption: number | null;
}

@Component({
  selector: 'app-quiz',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class QuizComponent implements OnInit, OnDestroy {
  // Simulated quiz data
  questions: Question[] = [
    {
      id: 1,
      category: 'Fundamental',
      question: 'What is the output of: console.log(typeof null)?',
      options: ['null', 'undefined', 'object', 'number'],
      correctAnswer: 2,
    },
    {
      id: 2,
      category: 'Framework',
      question: 'Which hook is used for side effects in React?',
      options: ['useState', 'useEffect', 'useContext', 'useMemo'],
      correctAnswer: 1,
    },
    {
      id: 3,
      category: 'State Management',
      question: 'What is Redux primarily used for?',
      options: ['Routing', 'State Management', 'API calls', 'Styling'],
      correctAnswer: 1,
    },
    {
      id: 4,
      category: 'Security',
      question: 'What does XSS stand for?',
      options: [
        'Cross-Site Scripting',
        'External Style Sheets',
        'XML Security Standard',
        'Extra Safe Storage',
      ],
      correctAnswer: 0,
    },
    {
      id: 5,
      category: 'Fundamental',
      question: 'What is closure in JavaScript?',
      options: [
        'A way to close browser windows',
        'A function with access to outer scope',
        'A CSS property',
        'A type of loop',
      ],
      correctAnswer: 1,
    },
  ];

  currentQuestionIndex = signal(0);
  answers = signal<Answer[]>([]);
  timeRemaining = signal(1800); // 30 minutes in seconds
  private timerInterval?: number;

  constructor(private router: Router) {
    // Initialize answers array
    this.answers.set(
      this.questions.map((q) => ({ questionId: q.id, selectedOption: null }))
    );
  }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    this.timerInterval = window.setInterval(() => {
      const current = this.timeRemaining();
      if (current > 0) {
        this.timeRemaining.set(current - 1);
      } else {
        this.stopTimer();
        this.submitQuiz();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex()];
  }

  get currentAnswer(): Answer {
    return this.answers()[this.currentQuestionIndex()];
  }

  get formattedTime(): string {
    const total = this.timeRemaining();
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  get progress(): number {
    return ((this.currentQuestionIndex() + 1) / this.questions.length) * 100;
  }

  selectOption(optionIndex: number) {
    const updatedAnswers = [...this.answers()];
    updatedAnswers[this.currentQuestionIndex()].selectedOption = optionIndex;
    this.answers.set(updatedAnswers);
  }

  previousQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() - 1);
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex() < this.questions.length - 1) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() + 1);
    } else {
      this.submitQuiz();
    }
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex.set(index);
  }

  submitQuiz() {
    this.stopTimer();
    // Navigate to results page
    this.router.navigate(['/assessment/result']);
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  get answeredCount(): number {
    return this.answers().filter((a) => a.selectedOption !== null).length;
  }
}
