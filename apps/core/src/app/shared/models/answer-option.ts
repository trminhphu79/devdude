import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Question } from './question';
import { AttemptAnswer } from './attempt-answer';

@Table({
  tableName: 'answer_options',
  timestamps: false,
  underscored: true,
})
export class AnswerOption extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Question)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'question_id',
  })
  questionId: string;

  @BelongsTo(() => Question)
  question: Question;

  @Column(DataType.STRING)
  text: string;

  @Column(DataType.BOOLEAN)
  isCorrect: boolean;

  @HasMany(() => AttemptAnswer)
  chosenInAttempts: AttemptAnswer[];
}
