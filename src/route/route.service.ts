import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { RouteDTO } from './dto';

@Injectable()
export class RouteService {
  constructor(private prisma: PrismaService) {}

  async getAllRoute(user = false) {
    const routes = await this.prisma.route.findMany({
      orderBy: {
        routeCode: 'asc',
      },
      where: {
        status: user ? 'active' : undefined,
      },
    });
    return routes;
  }

  async getRoute(routeId: string, user = false) {
    try {
      const route = await this.prisma.route.findFirstOrThrow({
        where: {
          id: routeId,
          status: user ? 'active' : undefined,
        },
      });
      return route;
    } catch (error) {
      throw new ForbiddenException('Route Not found!');
    }
  }

  async insertRoute(dto: RouteDTO) {
    const route = await this.prisma.route.create({
      data: {
        ...dto,
      },
    });
    return {
      message: 'Insert new bus route success!',
      route,
    };
  }

  async updateRoute(routeId: string, dto: RouteDTO) {
    try {
      return this.prisma.route.update({
        where: {
          id: routeId,
        },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      throw new ForbiddenException('Route Not found!');
    }
  }

  async deleteRoute(routeId: string) {
    try {
      await this.prisma.route.delete({
        where: {
          id: routeId,
        },
      });
      return {
        message: 'Route deleted!',
      };
    } catch (error) {
      throw new ForbiddenException('Route Not found!');
    }
  }
}
