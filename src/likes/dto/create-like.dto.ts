import { IsInt, IsNotEmpty } from "class-validator";

export class CreateLikeDto {

    @IsInt()
    @IsNotEmpty()
    user_id:number;
    @IsNotEmpty()
    @IsInt()
    article_id:number;
}
