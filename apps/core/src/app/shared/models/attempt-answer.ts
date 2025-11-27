import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Attempt } from './attempt';
import { Question } from './question';
import { AnswerOption } from './answer-option';

@Table({
  tableName: 'attempt_answers',
  timestamps: false,
  underscored: true,
})
export class AttemptAnswer extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Attempt)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'attempt_id',
  })
  attemptId: string;

  @BelongsTo(() => Attempt)
  attempt: Attempt;

  @ForeignKey(() => Question)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'question_id',
  })
  questionId: string;

  @BelongsTo(() => Question)
  question: Question;

  @ForeignKey(() => AnswerOption)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'answer_option_id',
  })
  answerOptionId: string;

  @BelongsTo(() => AnswerOption)
  answerOption: AnswerOption;

  @Column(DataType.TEXT)
  textAnswer: string;

  @Column(DataType.BOOLEAN)
  isCorrect: boolean;

  @Column(DataType.INTEGER)
  timeTakenSec: number;
}
