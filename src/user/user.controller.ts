import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDTO, PasswordDTO } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: string, @Body() dto: EditUserDTO) {
    return this.userService.editUser(userId, dto);
  }

  @Post('password')
  changePassword(@GetUser('id') userId: string, @Body() dto: PasswordDTO) {
    return this.userService.changePassword(dto, userId);
  }
}
