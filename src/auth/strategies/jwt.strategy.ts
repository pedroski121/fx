import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/users/user.service';
import { APIResponse } from 'src/common/responses/api-response';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret',
    });
  }

  async validate(payload: { email: string }) {
    const user = await this.userService.findUser(payload.email);

    if (!user) {
      return APIResponse.failure('User not found');
    }

    if (!user.isVerified) {
      return APIResponse.failure('Email not verified');
    }

    return {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
    };
  }
}
