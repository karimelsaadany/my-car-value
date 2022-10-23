import { BadRequestException, Body, Controller, HttpCode, HttpStatus, NotFoundException, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Serialize } from '../common/interceptor';
import { AuthService } from './auth.service';
import { AuthDto, SignInAuthDto, SignUpAuthDto } from './dto';
import { RefreshTokenGuard } from '../common/guard';
import { GetCurrentUser, Public } from '../common/decorator';

@Controller('auth')
@Serialize(AuthDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() authDto: SignUpAuthDto): Promise<AuthDto> {
    const data = await this.authService.signUp(authDto);
    if (!data) throw new BadRequestException('User already exists');

    return data;
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() authDto: SignInAuthDto): Promise<AuthDto> {
    const data = await this.authService.signIn(authDto);
    if (!data) throw new UnauthorizedException('Invalide Email or Password');

    return data;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetCurrentUser() userData: any
  ): Promise<AuthDto> {
    const { sub: userId, refreshToken } = userData;
    const data = await this.authService.refresh(userId, refreshToken);
    if (!data) throw new UnauthorizedException();

    return data;
  }
}
