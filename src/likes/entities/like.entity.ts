import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Article } from 'src/articles/entities/article.entity';
import { User } from 'src/users/dto/entities/user.entity';

@Table({
  tableName: 'likes',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'article_id'],
    },
  ],
})
export class Like extends Model<Like> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  user_id: number;

  @ForeignKey(() => Article)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  article_id: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Article)
  article: Article;
}
