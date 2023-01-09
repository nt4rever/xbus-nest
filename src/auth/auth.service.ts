import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO, EditDTO, SignUpDTO } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignUpDTO) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hash,
        },
      });
      delete user.password;
      delete user.refreshToken;

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        user,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  /**
   * It takes in an email and password, finds the user in the database, checks if the password matches,
   * and returns an access token and refresh token
   * @param {AuthDTO}  - AuthDTO -&gt;
   * @returns The access_token and refresh_token are being returned.
   */
  async signin({ email, password }: AuthDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect!');
    if (user.status === 'inactive')
      throw new ForbiddenException('Account has been denied');
    const pwMatches = await argon.verify(user.password, password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect!');
    delete user.password;
    delete user.refreshToken;
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user,
    };
  }

  async logout(userId: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          refreshToken: null,
        },
      });
      return {
        message: 'Log out success!',
      };
    } catch (err) {
      throw new ForbiddenException('Access Denied');
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user || !user.refreshToken)
        throw new ForbiddenException('Access Denied - user not found');
      const refreshTokenMatches = await argon.verify(
        user.refreshToken,
        refreshToken,
      );

      if (!refreshTokenMatches)
        throw new ForbiddenException('Access Denied - token error');
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      };
    } catch (err) {
      throw err;
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hash,
      },
    });
  }

  async getTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: '360m',
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * If the user is not the same as the current user, then update the user's password with the new
   * password.
   * @param {EditDTO} dto - EditDTO
   * @param {User} currentUser - User - this is the user that is currently logged in
   * @returns The return type is a promise.
   */
  async update(dto: EditDTO, currentUser: User) {
    try {
      const { id, ...data } = dto;
      if (currentUser.id === id) throw new ForbiddenException('Access Denied');

      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) throw new ForbiddenException('Access Denied');

      if (dto.password) {
        const hash = await argon.hash(dto.password);
        data.password = hash;
      }

      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          ...data,
        },
      });
      return {
        message: 'update auth success!',
      };
    } catch (err) {
      console.log(err);

      throw new ForbiddenException('Access Denied');
    }
  }

  /**
   * The function `getUsers` returns a promise that resolves to an array of users
   * @returns An array of users.
   */
  async getUsers() {
    const users = await this.prisma.user.findMany({});
    const userList = users.map((user) => {
      delete user.password;
      delete user.refreshToken;
      return user;
    });
    return userList;
  }
}
