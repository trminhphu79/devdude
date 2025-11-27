import { IAttemptAnswer } from './attempt-answer.interface';

export interface IAttempt {
  id: string;
  userId: string;
  templateId: string;
  startedAt: Date;
  finishedAt?: Date;
  totalScore?: number;
  level?: string;
  durationSec?: number;
  answers?: IAttemptAnswer[];
}
