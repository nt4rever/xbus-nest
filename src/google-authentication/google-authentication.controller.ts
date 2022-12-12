import { TokenVerificationDto } from './dto/tokenVerification.dto';
import { GoogleAuthenticationService } from './google-authentication.service';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('google-authentication')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  async authenticate(@Body() tokenData: TokenVerificationDto) {
    return this.googleAuthenticationService.authenticate(tokenData.token);
  }
}
