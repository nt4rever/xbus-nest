import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/enum';

export class EditDTO {
  @IsNotEmpty()
  @IsString()
  @Length(12)
  id: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsNotEmpty()
  @IsArray()
  roles: Role[];

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  password?: string;
}
