import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAllUsers();
  }

  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string) {
    return this.userService.findUserByEmail(email);
  }
}
