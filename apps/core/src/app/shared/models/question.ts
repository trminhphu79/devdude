import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from './category';
import { AnswerOption } from './answer-option';
import { AssessmentTemplateQuestion } from './assessment-template-question';
import { AttemptAnswer } from './attempt-answer';

@Table({
  tableName: 'questions',
  timestamps: true,
  underscored: true,
})
export class Question extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'category_id',
  })
  categoryId: string;

  @BelongsTo(() => Category)
  category: Category;

  @Column(DataType.ENUM('single-choice', 'multi-choice', 'code-text'))
  type: string;

  @Column(DataType.ENUM('Fresher', 'Junior', 'Mid', 'MidLate', 'Senior'))
  difficultyLevel: string;

  @Column(DataType.INTEGER)
  weight: number;

  @Column(DataType.INTEGER)
  timeLimitSec: number;

  @Column(DataType.TEXT)
  content: string;

  @Column(DataType.TEXT)
  explanation: string;

  @Column(DataType.STRING)
  createdBy: string;

  @HasMany(() => AnswerOption)
  options: AnswerOption[];

  @HasMany(() => AssessmentTemplateQuestion)
  inTemplates: AssessmentTemplateQuestion[];

  @HasMany(() => AttemptAnswer)
  attemptAnswers: AttemptAnswer[];
}
