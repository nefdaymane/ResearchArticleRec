import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { CustomHttpException } from 'src/common/filters/custom-http.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from 'src/modules/users/services/hash.service';
import { generateSuccessResponse } from 'src/utils/response.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private hashService: HashService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new CustomHttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await this.hashService.hash(createUserDto.password);

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    await user.save();

    return generateSuccessResponse(user, 'User created successfully');
  }

  async findAllUsers(): Promise<ApiResponse<User[]>> {
    const users = await this.userModel.find();

    if (!users) {
      throw new CustomHttpException('No users found', HttpStatus.NOT_FOUND);
    }
    return generateSuccessResponse(users, 'Users fetched successfully');
  }

  async findUserById(id: string): Promise<ApiResponse<User>> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new CustomHttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return generateSuccessResponse(user, 'User fetched successfully');
  }

  async findUserByEmail(email: string): Promise<ApiResponse<User>> {
    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new CustomHttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return generateSuccessResponse(user, 'User fetched successfully');
  }
}
