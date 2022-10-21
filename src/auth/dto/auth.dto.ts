import { Type } from "class-transformer";
import { UserDto } from "src/users/dto/user.dto";

export class AuthDto {
  accessToken: string;
  @Type(() => UserDto)
  user: UserDto;
}
