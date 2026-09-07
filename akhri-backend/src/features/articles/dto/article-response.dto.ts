interface BloggerSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AnalysisSummary {
  id: number;
  summarisedStory: string | null;
  differencesData: Record<string, any>;
}

export interface ArticleResponse {
  id: number;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  imageUrl: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  blogger: BloggerSummary | null;
  analysis: AnalysisSummary | null;
}

export type AnalysisResult = {
  excerpt: string;
  summarisedStory: string;
  analysisData: {
    wordCount: number;
    readingTimeMinutes: number;
    sentiment: string;
    keywords: string[];
    generatedAt: string;
  };
};