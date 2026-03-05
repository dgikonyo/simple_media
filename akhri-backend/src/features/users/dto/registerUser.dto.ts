import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsDateString()
  dob?: string; // will be parsed to Date

  @IsNumber()
  @IsOptional()
  countryId?: number;

  @IsNumber()
  @IsNotEmpty()
  roleId?: number;
}
