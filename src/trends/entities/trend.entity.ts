import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/dto/entities/user.entity";

@Table({tableName: 'trends'})
export class Trend extends Model<Trend> {
    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false
    })
    medias_urls: string[];
    
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    slug: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    text: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    url_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    url_link: string;

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
    author_id: number;

    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    category_id: number;


   @BelongsTo(() => User)
   author: User;

   @BelongsTo(() => Category)
   category: Category;
}