import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesAnalysisService } from './articles-analysis.service';

describe('ArticlesAnalysisService', () => {
  let service: ArticlesAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesAnalysisService],
    }).compile();

    service = module.get<ArticlesAnalysisService>(ArticlesAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
