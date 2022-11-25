import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { RouteDTO } from './dto';

@Injectable()
export class RouteService {
  constructor(private prisma: PrismaService) {}

  async getAllRoute() {
    const routes = await this.prisma.route.findMany({});
    return routes;
  }

  async insertRoute(dto: RouteDTO) {
    const route = await this.prisma.route.create({
      data: {
        ...dto,
      },
    });
    return {
      message: 'Insert new bus route success',
      route,
    };
  }
}
