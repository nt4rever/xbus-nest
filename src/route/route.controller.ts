import { RolesGuard } from './../auth/guard/roles.guard';
import { Role } from './../enum/role.enum';
import { Roles } from './../auth/decorator/roles.decorator';
import { JwtGuard } from './../auth/guard/jwt.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RouteDTO } from './dto';
import { RouteService } from './route.service';

@Controller('route')
export class RouteController {
  constructor(private routeService: RouteService) {}

  @Get()
  getAllRoute() {
    return this.routeService.getAllRoute();
  }

  @Get(':id')
  getRoute(@Param('id') id: string) {
    return this.routeService.getRoute(id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('create')
  @HttpCode(HttpStatus.OK)
  indertRoute(@Body() dto: RouteDTO) {
    return this.routeService.insertRoute(dto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  updatetRoute(@Param('id') id: string, @Body() dto: RouteDTO) {
    return this.routeService.updateRoute(id, dto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  deleteRoute(@Param('id') id: string) {
    return this.routeService.deleteRoute(id);
  }
}
