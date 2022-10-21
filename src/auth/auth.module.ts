import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenJwt } from './strategies/accessToken.strategy';
import { RefreshTokenJwt } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenJwt, RefreshTokenJwt]
})
export class AuthModule {}
