import { PrismaService } from './../prisma/prisma.service';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { StationDTO, UpdateStationDTO } from './dto';

@Injectable()
export class StationService {
  constructor(private prisma: PrismaService) {}

  async insertStation(dto: StationDTO) {
    try {
      return this.prisma.station.create({
        data: {
          ...dto,
        },
      });
    } catch (error) {
      throw new ForbiddenException('Access to resources denied!');
    }
  }

  async getStations(id: string) {
    try {
      const stations = await this.prisma.station.findMany({
        where: {
          routeId: id,
        },
      });
      return stations;
    } catch (error) {
      throw new ForbiddenException('Access to resources denied!');
    }
  }

  async updateStation(dto: UpdateStationDTO) {
    try {
      const { id, ...station } = dto;
      const s = await this.prisma.station.findUnique({
        where: {
          id: id,
        },
      });
      if (!s) throw new ForbiddenException('Access to resources denied!');
      return this.prisma.station.update({
        where: {
          id: id,
        },
        data: {
          ...station,
        },
      });
    } catch (error) {
      throw new ForbiddenException('Access to resources denied!');
    }
  }
}
