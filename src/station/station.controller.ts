import { RolesGuard } from './../auth/guard/roles.guard';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { StationService } from './station.service';
import { GetStationDTO, StationDTO, UpdateStationDTO } from './dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../enum';

@Controller('station')
export class StationController {
  constructor(private stationService: StationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  getStations(@Body() dto: GetStationDTO) {
    return this.stationService.getStations(dto.routeId);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('create')
  @HttpCode(HttpStatus.OK)
  insertSatation(@Body() dto: StationDTO) {
    return this.stationService.insertStation(dto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('update')
  @HttpCode(HttpStatus.OK)
  updateSatation(@Body() dto: UpdateStationDTO) {
    return this.stationService.updateStation(dto);
  }
}
