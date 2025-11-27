export enum QuestionType {
  SINGLE_CHOICE = 'single-choice',
  MULTI_CHOICE = 'multi-choice',
  CODE_TEXT = 'code-text',
}

export enum DifficultyLevel {
  FRESHER = 'Fresher',
  JUNIOR = 'Junior',
  MID = 'Mid',
  MID_LATE = 'MidLate',
  SENIOR = 'Senior',
}

export enum UserLevel {
  EARLY_JUNIOR = 'Early Junior',
  JUNIOR = 'Junior',
  MID = 'Mid',
  MID_LATE = 'Mid Late',
  SENIOR = 'Senior',
}

export enum QuestionDifficulty {
  EarlyJunior = 1,
  Junior,
  Middle,
  MiddleLate,
  Senior,
}

export enum QuestionWeight {
  Fresher = 1,
  Junior = 2,
  Mid = 3,
  MidLate = 4,
  Senior = 5,
}

export enum QuestionCount {
  Fresher = 12,
  Junior = 21,
  Mid = 6,
  MidLate = 2,
  Senior = 4,
}
