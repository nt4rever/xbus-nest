import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RouteModule } from './route/route.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StationModule } from './station/station.module';
import { RatingModule } from './rating/rating.module';
import { GoogleAuthenticationModule } from './google-authentication/google-authentication.module';
import { PageModule } from './page/page.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RouteModule,
    AuthModule,
    UserModule,
    StationModule,
    RatingModule,
    GoogleAuthenticationModule,
    PageModule,
  ],
})
export class AppModule {}
