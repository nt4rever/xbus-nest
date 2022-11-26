import { IsNotEmpty, IsString, Length } from 'class-validator';

export class GetStationDTO {
  @IsString()
  @IsNotEmpty()
  @Length(12)
  routeId: string;
}
