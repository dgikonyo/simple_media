import { Module } from '@nestjs/common';
import { PromptsController } from './prompts.controller';
import { PromptsService } from './prompts.service';
import { HttpModule } from '@nestjs/axios';
import { ArticlesAnalysisService } from '../articles-analysis/articles-analysis.service';

@Module({
  imports: [HttpModule],
  controllers: [PromptsController],
  providers: [PromptsService, ArticlesAnalysisService]
})
export class PromptsModule { }
