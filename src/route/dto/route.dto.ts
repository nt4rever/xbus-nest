import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RouteDTO {
  @IsString()
  @IsNotEmpty()
  routeCode: string;

  @IsString()
  @IsNotEmpty()
  routeName: string;

  @IsString()
  @IsNotEmpty()
  forwardTrip: string;

  @IsString()
  @IsNotEmpty()
  backwardTrip: string;

  @IsString()
  @IsNotEmpty()
  betweenTwoBus: string;

  @IsString()
  @IsNotEmpty()
  numberOfTrips: string;

  @IsString()
  @IsNotEmpty()
  operatingTime: string;

  @IsString()
  @IsNotEmpty()
  routeLength: string;

  @IsString()
  @IsNotEmpty()
  ticketPrice: string;

  @IsString()
  @IsOptional()
  status: string;
}
