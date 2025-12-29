import { Column, DataType, Model, Table } from "sequelize-typescript";

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
}