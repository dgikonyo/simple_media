import { IsString, IsNotEmpty, IsOptional, IsUUID, IsJSON, IsObject } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  body?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  // The analysis data as a raw JSON object
  @IsOptional()
  @IsObject()
  analysisData?: Record<string, any>;

  @IsString()
  @IsOptional()
  summarisedStory?: string;
}