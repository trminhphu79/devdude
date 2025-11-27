import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Topic } from './topic';
import { AssessmentTemplateQuestion } from './assessment-template-question';
import { Attempt } from './attempt';

@Table({
  tableName: 'assessment_templates',
  timestamps: true,
  underscored: true,
})
export class AssessmentTemplate extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Topic)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'topic_id',
  })
  topicId: string;

  @BelongsTo(() => Topic)
  topic: Topic;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  description: string;

  @Column(DataType.INTEGER)
  totalQuestions: number;

  @Column(DataType.JSON)
  difficultyDistribution: any;

  @HasMany(() => AssessmentTemplateQuestion)
  templateQuestions: AssessmentTemplateQuestion[];

  @HasMany(() => Attempt)
  attempts: Attempt[];
}
