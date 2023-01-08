import { CreateRatingDTO, DeleteRatingDTO } from './dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async createRating(user: User, rating: CreateRatingDTO) {
    await this.prisma.rating.create({
      data: {
        ...rating,
        name: `${user.firstName} ${user.lastName}`,
        userId: user.id,
      },
    });
    return await this.prisma.rating.findMany({
      where: {
        routeId: rating.routeId,
      },
      orderBy: {
        time: 'desc',
      },
    });
  }

  async getRatingsByRouteId(routeId: string, takeRating: number) {
    try {
      const ratings = await this.prisma.rating.findMany({
        take: takeRating,
        where: {
          routeId,
        },
        orderBy: {
          time: 'desc',
        },
      });
      return ratings;
    } catch (err) {
      throw new ForbiddenException('Access to resources denied!');
    }
  }

  async getStatisRatingByRouteId(routeId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: {
        routeId,
      },
    });
    const barChart = Array.from({ length: 5 }).map((_, i) => {
      const index = 4 - i;
      const percent =
        ratings.length > 0
          ? (ratings.filter((item) => Math.ceil(item.rating) === index + 1)
              .length *
              100) /
            ratings.length
          : 0;
      return {
        index: index + 1,
        percent: percent,
      };
    });

    const ratingAvg =
      ratings.length > 0
        ? Math.round(
            (ratings.reduce((n, { rating }) => n + Number(rating), 0) * 100) /
              ratings.length,
          ) / 100
        : 0;

    return {
      barChart,
      ratingAvg,
      total: ratings.length,
    };
  }

  async deleteRating(user: User, dto: DeleteRatingDTO) {
    try {
      const rating = await this.prisma.rating.findUnique({
        where: {
          id: dto.ratingId,
        },
      });

      if (!rating || rating.userId !== user.id) {
        throw new ForbiddenException('Access to resources denied!');
      }

      await this.prisma.rating.delete({
        where: {
          id: dto.ratingId,
        },
      });

      return {
        message: 'Delete rating success!',
      };
    } catch (err) {
      throw new ForbiddenException('Access to resources denied!');
    }
  }

  async deleteRatingAdmin(dto: DeleteRatingDTO) {
    try {
      await this.prisma.rating.delete({
        where: {
          id: dto.ratingId,
        },
      });

      return {
        message: 'Delete rating success!',
      };
    } catch (err) {
      throw new ForbiddenException('Access to resources denied!');
    }
  }
}
