export interface IAssessmentTemplate {
  id: string;
  topicId: string;
  name: string;
  description: string;
  totalQuestions: number;
  difficultyDistribution: {
    Fresher?: number;
    Junior?: number;
    Mid?: number;
    MidLate?: number;
    Senior?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
