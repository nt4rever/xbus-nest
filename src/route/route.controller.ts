import { JwtGuard } from './../auth/guard/jwt.guard';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RouteDTO } from './dto';
import { RouteService } from './route.service';

@Controller('route')
export class RouteController {
  constructor(private routeService: RouteService) {}

  @Get()
  getAllRoute() {
    return this.routeService.getAllRoute();
  }

  @UseGuards(JwtGuard)
  @Post('create')
  indertRoute(@Body() dto: RouteDTO) {
    return this.routeService.insertRoute(dto);
  }
}
