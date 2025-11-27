import { IAnswerOption } from './answer-option.interface';

export interface IQuestion {
  id: string;
  categoryId: string;
  type: 'single-choice' | 'multi-choice' | 'code-text';
  difficultyLevel: 'Fresher' | 'Junior' | 'Mid' | 'MidLate' | 'Senior';
  weight: number;
  timeLimitSec: number;
  content: string;
  explanation: string;
  createdBy: string;
  options?: IAnswerOption[];
  createdAt?: Date;
  updatedAt?: Date;
}
