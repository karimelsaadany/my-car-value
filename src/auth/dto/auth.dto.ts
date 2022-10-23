import { Type } from "class-transformer";
import { UserDto } from "../../users/dto";

export class AuthDto {
  accessToken: string;
  refreshToken: string;
  @Type(() => UserDto)
  user: UserDto;
}
