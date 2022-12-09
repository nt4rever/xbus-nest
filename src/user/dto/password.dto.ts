import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class PasswordDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(16)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(16)
  newPassword: string;
}
