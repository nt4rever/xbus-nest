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
        orderBy: {
          order: 'asc',
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

  async updateStations(stations: UpdateStationDTO[]) {
    try {
      const transactions = [];
      stations.forEach((station) => {
        const { id, ...data } = station;
        transactions.push(
          this.prisma.station.update({
            where: {
              id: id,
            },
            data: {
              ...data,
            },
          }),
        );
      });
      await this.prisma.$transaction(transactions);
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Access to resources denied!');
    }
  }

  async deleteStation(stationId: string) {
    try {
      await this.prisma.station.delete({
        where: {
          id: stationId,
        },
      });
      return {
        message: 'Delete station success!',
      };
    } catch (error) {
      throw new ForbiddenException('Access to resources denied!');
    }
  }
}
