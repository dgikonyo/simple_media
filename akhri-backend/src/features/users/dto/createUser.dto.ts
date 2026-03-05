import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  isString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsEmail()
  email?: string;

  @IsDateString()
  dob?: Date;

  @IsNumber()
  countryId?: number;

  @IsNumber()
  roleId?: number;
}
