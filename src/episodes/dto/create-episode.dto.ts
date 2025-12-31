import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateEpisodeDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsUrl()
    @IsNotEmpty()
    yt_link: string;

    thumbnail_url?: string;

    @IsString()
    @IsNotEmpty()
    text: string;

    category_id?: number;
}
