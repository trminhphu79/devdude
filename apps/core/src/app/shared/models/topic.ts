import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Category } from './category';
import { AssessmentTemplate } from './assessment-template';

@Table({
  tableName: 'topics',
  timestamps: true,
  underscored: true,
})
export class Topic extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column(DataType.STRING(256))
  name: string;

  @Column(DataType.STRING(256))
  description: string;

  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @HasMany(() => Category)
  categories: Category[];

  @HasMany(() => AssessmentTemplate)
  assessmentTemplates: AssessmentTemplate[];
}
