import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"
import { Request } from "express";
import { Strategy, ExtractJwt } from "passport-jwt"
import { JwtPayload } from "../../common/types";

@Injectable()
export class RefreshTokenJwt extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true
    })
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return {
      ...payload,
      refreshToken
    };
  }
}