import { Injectable } from '@nestjs/common';
import { Tokens } from '../common/types';
import { AuthDto, SignInAuthDto, SignUpAuthDto } from './dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UserDto } from '../users/dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signUp(signUpAuthDto: SignUpAuthDto): Promise<AuthDto> {
    const { email, password } = signUpAuthDto;

    const user = await this.usersService.create({ email, password });
    if (!user) return;

    const tokens = await this.getTokens(user.id, email);
    const updatedUser = await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: updatedUser
    };
  }

  async signIn(signInAuthDto: SignInAuthDto): Promise<AuthDto> {
    const { email, password } = signInAuthDto;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return;

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return;

    const tokens = await this.getTokens(user.id, email);
    const updatedUser = await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: updatedUser
    };
  }

  async logout(userId: number): Promise<AuthDto> {
    const user = await this.usersService.update(userId, { refreshToken: null });
    if (!user) return;

    return {
      accessToken: null,
      refreshToken: null,
      user
    };
  }

  async refresh(userId: number, refreshToken: string): Promise<AuthDto> {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken) return;

    const refreshTokenMatch = bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatch) return

    const tokens = await this.getTokens(userId, user.email);

    return {
      accessToken: tokens.accessToken,
      refreshToken,
      user
    };
  }

  private async getTokens(userId: number, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m'
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d'
        }
      )
    ]);

    return {
      accessToken,
      refreshToken
    }
  }

  private async updateRefreshToken(userId: number, refreshToken: string): Promise<UserDto> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    return this.usersService.update(
      userId, { refreshToken: hashedRefreshToken }
    )
  }
}
