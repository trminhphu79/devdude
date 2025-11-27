import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Account } from './account';
import { AssessmentTemplate } from './assessment-template';
import { AttemptAnswer } from './attempt-answer';

@Table({
  tableName: 'attempts',
  timestamps: true,
  underscored: true,
})
export class Attempt extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Account)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'account_id',
  })
  accountId: string;

  @BelongsTo(() => Account)
  account: Account;

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
