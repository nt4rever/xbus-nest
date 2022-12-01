import { IsString, IsNotEmpty, Length } from 'class-validator';

export class DeleteRatingDTO {
  @IsString()
  @IsNotEmpty()
  @Length(12)
  ratingId: string;
}
