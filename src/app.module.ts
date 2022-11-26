import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RouteModule } from './route/route.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StationModule } from './station/station.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RouteModule,
    AuthModule,
    UserModule,
    StationModule,
  ],
})
export class AppModule {}
