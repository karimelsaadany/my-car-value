import { BadRequestException, Body, Controller, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Serialize } from 'src/common/interceptor/serializer.interceptor';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { AuthDto } from './dto/auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { RefreshTokenGuard } from 'src/common/guard/index';
import { GetCurrentUser } from 'src/common/decorator/get-current-user.decorator';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('auth')
@Serialize(AuthDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/signup')
  async signUp(@Body() authDto: SignUpAuthDto): Promise<AuthDto> {
    const data = await this.authService.signUp(authDto);
    if (!data) throw new BadRequestException('User already exists');
    return data;
  }

  @Public()
  @Post('local/signin')
  async signIn(@Body() authDto: SignInAuthDto): Promise<AuthDto> {
    const data = await this.authService.signIn(authDto);
    if (!data) throw new UnauthorizedException('Invalide Email or Password');
    return data;
  }

  @Post('logout')
  async logout(
    @GetCurrentUser() userData: any
  ): Promise<AuthDto> {
    const { sub: userId } = userData;
    const data = await this.authService.logout(userId);
    if (!data) throw new NotFoundException('User does not exist');

    return data;
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @GetCurrentUser() userData: any
  ): Promise<AuthDto> {
    const { sub: userId, refreshToken } = userData;
    const data = await this.authService.refresh(userId, refreshToken);
    if (!data) throw new UnauthorizedException();

    return data;
  }
}
