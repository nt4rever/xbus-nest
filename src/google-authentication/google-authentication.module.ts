import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { GoogleAuthenticationService } from './google-authentication.service';
import { GoogleAuthenticationController } from './google-authentication.controller';

@Module({
  imports: [AuthModule],
  providers: [GoogleAuthenticationService],
  controllers: [GoogleAuthenticationController],
})
export class GoogleAuthenticationModule {}
