import { RolesGuard } from './../auth/guard/roles.guard';
import { Role } from './../enum/role.enum';
import { GetUser } from './../auth/decorator/get-user.decorator';
import { JwtGuard } from './../auth/guard/jwt.guard';
import { Roles } from './../auth/decorator/roles.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateRatingDTO, DeleteRatingDTO } from './dto';
import { RatingService } from './rating.service';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getRatingsByRouteId(
    @Param('id') routeId: string,
    @Query('take', ParseIntPipe) take: number,
  ) {
    return this.ratingService.getRatingsByRouteId(routeId, take);
  }

  @Get('statis/:id')
  @HttpCode(HttpStatus.OK)
  getStatisRatingByRouteId(@Param('id') routeId: string) {
    return this.ratingService.getStatisRatingByRouteId(routeId);
  }

  @UseGuards(JwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.OK)
  createRating(@GetUser() user: User, @Body() rating: CreateRatingDTO) {
    return this.ratingService.createRating(user, rating);
  }

  @UseGuards(JwtGuard)
  @Post('delete')
  @HttpCode(HttpStatus.OK)
  deleteRating(@GetUser() user: User, @Body() dto: DeleteRatingDTO) {
    return this.ratingService.deleteRating(user, dto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('delete/admin')
  @HttpCode(HttpStatus.OK)
  deleteRatingAdmin(@Body() dto: DeleteRatingDTO) {
    return this.ratingService.deleteRatingAdmin(dto);
  }
}
