// src/user/dto/complete-profile.dto.ts
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class CompleteProfileDto {
    @IsDateString()
    dob?: string;

    @IsInt()
    @Min(1)
    roleId?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    countryId?: number;
}