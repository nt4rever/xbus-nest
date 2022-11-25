import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { EditUserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: string, dto: EditUserDTO) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete user.password;
    return user;
  }
}
