import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user';
import { AssessmentTemplate } from './assessment-template';
import { AttemptAnswer } from './attempt-answer';

@Table({
  tableName: 'attempts',
  timestamps: false,
  underscored: true,
})
export class Attempt extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => AssessmentTemplate)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'template_id',
  })
  templateId: string;

  @BelongsTo(() => AssessmentTemplate)
  template: AssessmentTemplate;

  @Column(DataType.DATE)
  startedAt: Date;

  @Column(DataType.DATE)
  finishedAt: Date;

  @Column(DataType.INTEGER)
  totalScore: number;

  @Column(DataType.STRING)
  level: string;

  @Column(DataType.INTEGER)
  durationSec: number;

  @HasMany(() => AttemptAnswer)
  answers: AttemptAnswer[];
}
