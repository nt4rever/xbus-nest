import { Controller, Get, Render } from '@nestjs/common';

@Controller('page')
export class PageController {
  @Get('/')
  @Render('index')
  signInPage() {
    return {};
  }
}
