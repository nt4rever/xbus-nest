import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO, SignUpDTO } from './dto';
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
      const token = await this.signToken(user.id, user.email);
      return { ...token, user };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin({ email, password }: AuthDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect!');

    const pwMatches = await argon.verify(user.password, password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect!');
    delete user.password;
    const token = await this.signToken(user.id, user.email);
    return { ...token, user };
  }

  async refresh(user: User) {
    const token = await this.signToken(user.id, user.email);
    return { ...token, user };
  }

  private async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const privateKey = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '360m',
      privateKey: privateKey,
    });
    return {
      access_token: token,
    };
  }
}
