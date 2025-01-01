import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/modules/users/services/hash.service';
import { CustomHttpException } from 'src/common/filters/custom-http.exception';
import { User, UserDocument } from '../users/user.schema';
import { generateSuccessResponse } from 'src/utils/response.utils';
import { RegisterDto } from './dto/register.dto';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<ApiResponse<{ user: User; access_token: string }>> {
    const userResponse = await this.usersService.createUser(registerDto);

    if (!userResponse.data) {
      throw new CustomHttpException(
        userResponse.message,
        userResponse.statusCode,
      );
    }

    const user = userResponse.data as UserDocument;

    const access_token = this.jwtService.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      { expiresIn: '1d' },
    );

    return generateSuccessResponse(
      { user, access_token },
      'User registered successfully',
    );
  }

  async login(
    loginDto: LoginDto,
  ): Promise<ApiResponse<{ user: User; access_token: string }>> {
    const userResponse = await this.usersService.findUserByEmail(
      loginDto.email,
    );

    if (!userResponse.data) {
      throw new CustomHttpException(
        userResponse.message,
        userResponse.statusCode,
      );
    }

    const user = userResponse.data as UserDocument;

    const isPasswordValid = await this.hashService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new CustomHttpException('Invalid email or password', 400);
    }

    const access_token = this.jwtService.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      { expiresIn: '1d' },
    );

    return generateSuccessResponse(
      { user, access_token },
      'User logged in successfully',
    );
  }
}
