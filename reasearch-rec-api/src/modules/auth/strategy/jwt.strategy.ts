import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from 'src/config/config.service';
import { User } from 'src/modules/users/user.schema';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UsersService,
    configService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: { sub: string; email: string }): Promise<User> {
    const userResponse = await this.userService.findUserById(payload.sub);
    if (!userResponse) {
      throw new UnauthorizedException();
    }
    const user = userResponse.data;
    return user;
  }
}
