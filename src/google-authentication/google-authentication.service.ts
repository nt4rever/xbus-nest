import { PrismaService } from './../prisma/prisma.service';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { User } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common/exceptions';

@Injectable()
export class GoogleAuthenticationService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');
    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async authenticate(token: string) {
    try {
      const tokenInfo = await this.oauthClient.getTokenInfo(token);
      const email = tokenInfo.email;
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });
      if (user) return this.handleSignIn(user);
      return this.handelSignUp(token, email);
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect!');
    }
  }

  async handleSignIn(user: User) {
    if (user.status === 'inactive')
      throw new ForbiddenException('Account has been denied');
    const tokens = await this.authService.getTokens(user.id, user.email);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);
    delete user.password;
    delete user.refreshToken;
    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user,
    };
  }

  async handelSignUp(token: string, email: string) {
    const userData = await this.getUserData(token);
    return this.authService.signup({
      email,
      firstName: userData.family_name,
      lastName: userData.given_name,
      password: Math.random().toString(36).slice(-10),
    });
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;
    this.oauthClient.setCredentials({
      access_token: token,
    });
    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });
    return userInfoResponse.data;
  }
}
