import { IsEmail, IsString } from "class-validator";

export class SignUpAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
