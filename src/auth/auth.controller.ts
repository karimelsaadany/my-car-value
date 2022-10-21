import { BadRequestException, Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { Serialize } from 'src/interceptor/serializer.interceptor';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { AuthDto } from './dto/auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';

@Controller('auth')
@Serialize(AuthDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  async signUp(@Body() authDto: SignUpAuthDto): Promise<AuthDto> {
    const user = await this.authService.signUp(authDto);
    if (!user) throw new BadRequestException('User already exists');
    return user;
  }

  @Post('local/signin')
  async signIn(@Body() authDto: SignInAuthDto): Promise<AuthDto> {
    const user = await this.authService.signIn(authDto);
    if (!user) throw new UnauthorizedException('Invalide Email or Password');
    return user;
  }
}
