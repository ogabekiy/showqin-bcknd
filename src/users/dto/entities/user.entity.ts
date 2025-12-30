import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Article } from "src/articles/entities/article.entity";
import { Trend } from "src/trends/entities/trend.entity";

@Table({tableName: 'users'})
export class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: true
    })
    username: string
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    })
    email: string;


    @Column({
        type: DataType.STRING,
        allowNull: true,
        validate: {
            is: /^[0-9+\-() ]+$/i
        }
    })
    phone_number: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            len: [5, 100]
        }
    })
    password: string;

    @Column({
        type: DataType.ENUM('user', 'admin','author'),
        defaultValue: 'user'
    })
    role: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    is_active: boolean;


    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    bio: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    avatar_url: string;

    @HasMany(() => Article)
    articles: Article[];

    @HasMany(() => Trend)
    trends: Trend[];
}