export interface IAttemptAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  answerOptionId?: string;
  textAnswer?: string;
  isCorrect: boolean;
  timeTakenSec: number;
}
