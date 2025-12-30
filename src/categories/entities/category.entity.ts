import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Article } from "src/articles/entities/article.entity";

@Table({tableName: 'categories'})
export class Category extends Model<Category>{
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name :string

    @Column({
        type: DataType.STRING,
        allowNull:true,
    })
    description: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    slug :string

    @HasMany(() => Article)
    articles: Article[];
}