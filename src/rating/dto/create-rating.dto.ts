import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateRatingDTO {
  @IsString()
  @IsNotEmpty()
  @Length(12)
  routeId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}
