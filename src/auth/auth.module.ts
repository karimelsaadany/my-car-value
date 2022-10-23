import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenJwt, RefreshTokenJwt } from './strategies';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenJwt, RefreshTokenJwt]
})
export class AuthModule {}
