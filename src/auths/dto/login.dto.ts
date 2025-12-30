import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateLoginDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string 
}