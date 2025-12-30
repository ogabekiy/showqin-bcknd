import { IsArray, ArrayNotEmpty, IsString, IsOptional, IsInt, Min, IsUrl, Length, Matches, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTrendDto {
e
  medias_urls: string[];

  @IsString()
  @Length(3, 255)
  title: string;

  @IsString()
  @Length(3, 5000)
  text: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug faqat kichik harflar, raqamlar va "-" belgilaridan iborat bo‘lishi kerak',
  })
  slug: string;

  @IsString()
  @IsOptional()
  url_name?: string;

  @IsUrl()
  url_link?: string;

  @IsInt()
  @Type(() => Number)
  author_id: number;

  @IsInt()
  @Type(() => Number)
  category_id: number;
}
