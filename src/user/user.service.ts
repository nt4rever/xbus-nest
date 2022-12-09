import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { EditUserDTO, PasswordDTO } from './dto';
import * as argon from 'argon2';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * It takes a userId and a dto (data transfer object) and updates the user with the given userId with
   * the data from the dto
   * @param {string} userId - The id of the user we want to edit.
   * @param {EditUserDTO} dto - EditUserDTO
   * @returns The user object with the updated information.
   */
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

  /**
   * It takes a user's id and a PasswordDTO object, which contains the user's old password and new
   * password. It then checks if the old password matches the user's password in the database. If it
   * does, it hashes the new password and updates the user's password in the database
   * @param {PasswordDTO} dto - PasswordDTO - this is the data transfer object that we will use to pass
   * the old and new password to the function.
   * @param {string} id - the id of the user
   */
  async changePassword(dto: PasswordDTO, id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      const pwMatches = await argon.verify(user.password, dto.oldPassword);
      if (!pwMatches) throw new ForbiddenException('Access denied!');

      const hash = await argon.hash(dto.newPassword);
      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          password: hash,
        },
      });

      return {
        message: 'change password success',
      };
    } catch (err) {
      throw new ForbiddenException('Access denied!');
    }
  }
}
