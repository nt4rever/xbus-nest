import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class StationDTO {
  @IsNotEmpty()
  @IsString()
  @Length(12)
  routeId: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['forward', 'back'])
  direction: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  lng: number;

  @IsBoolean()
  @IsOptional()
  mapDirection: boolean;
}
