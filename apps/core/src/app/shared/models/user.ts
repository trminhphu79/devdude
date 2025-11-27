import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Attempt } from './attempt';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  fullName: string;

  @HasMany(() => Attempt)
  attempts: Attempt[];
}
