import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Category } from "src/categories/entities/category.entity";
import { Like } from "src/likes/entities/like.entity";
import { User } from "src/users/dto/entities/user.entity";

@Table({tableName: 'articles'})
export class Article extends Model<Article> {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    slug: string

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    summary_text: string

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    content: string

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    thumbnail_url: string
    

    @Column({
        type: DataType.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft'
    })
    status: 'draft' | 'published' | 'archived'


    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        defaultValue: 1,
        get() {
    const rawValue = this.getDataValue('views_count');
    return Number(rawValue); 
  }
    })
    views_count: number

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    author_id: number

    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    category_id: number

    @BelongsTo(() => User)
    author: User

    @BelongsTo(() => Category)
    category: Category

    @HasMany(() => Like)
    likes: Like[];
}