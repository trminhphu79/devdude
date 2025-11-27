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
import { Question } from './question';

@Table({ tableName: 'categories' })
export class Category extends Model {
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

  @HasMany(() => Question)
  questions: Question[];
}
