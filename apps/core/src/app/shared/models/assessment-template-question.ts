import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { AssessmentTemplate } from './assessment-template';
import { Question } from './question';

@Table({
  tableName: 'assessment_template_questions',
  timestamps: false,
  underscored: true,
})
export class AssessmentTemplateQuestion extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => AssessmentTemplate)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'template_id',
  })
  templateId: string;

  @BelongsTo(() => AssessmentTemplate)
  template: AssessmentTemplate;

  @ForeignKey(() => Question)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'question_id',
  })
  questionId: string;

  @BelongsTo(() => Question)
  question: Question;

  @Column(DataType.INTEGER)
  orderIndex: number;
}
