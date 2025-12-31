import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Category } from "src/categories/entities/category.entity";

@Table({tableName: 'episodes'})
export class Episode extends Model<Episode>{
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    yt_link: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    thumbnail_url: string

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    text: string;

    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    category_id: number;

    @BelongsTo(() => Category)
    category: Category;
}