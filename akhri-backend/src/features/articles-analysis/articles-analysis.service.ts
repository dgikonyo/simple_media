import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';
import { AnalysisResult } from '../articles/dto/article-response.dto';

@Injectable()
export class ArticlesAnalysisService {
    private readonly ollamaUrl: string;
    private readonly ollamaModel: string;
    private readonly logger = new Logger(ArticlesAnalysisService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.ollamaUrl = this.configService.get<string>('OLLAMA_URL')!;
        this.ollamaModel = this.configService.get<string>('OLLAMA_MODEL')!;
    }

    async generate(prompt: string): Promise<string> {
        this.logger.log(`Generating AI analysis...`);

        try {
            if (!this.ollamaUrl) {
                throw Error('Ollama URL not provided');
            } else if (!this.ollamaModel) {
                throw Error('Ollama URL not provided');
            }

            const response: any = await firstValueFrom(
                this.httpService.post(`${this.ollamaUrl}/api/generate`, {
                    model: this.ollamaModel,
                    prompt: prompt,
                    stream: false,
                }),
            );

            return response.data.response;
        } catch (error: any) {
            this.logger.error(`Ollama API error`, error.stack);
            throw new Error(`${error.message}`);
        }
    }

    async analyzeArticle(title: string, body: string): Promise<AnalysisResult> {
        // 1. Compute these server-side
        const wordCount = body.split(/\s+/).filter(w => w.length > 0).length;
        const readingTimeMinutes = Math.ceil(wordCount / 200);
        const generatedAt = new Date().toISOString();

        // 2. Build the prompt
        const prompt = `You are an expert AI article analyst. Your task is to analyze the provided article title and body, and return a JSON object containing a short excerpt, a summarized story, a sentiment analysis, and a list of keywords.
            Instructions:
            1. Generate a compelling "excerpt" (max 30 words) that hooks the reader.
            2. Generate a "summarisedStory" (2-3 concise sentences) that captures the core argument or main points.
            3. Determine the overall "sentiment" of the article body (must be exactly one of: "positive", "neutral", or "negative").
            4. Extract the top 5 to 7 most relevant "keywords" (nouns, concepts, or specific terms) from the body.

            Critical Constraints:
            - Output ONLY valid JSON.
            - Do NOT wrap the JSON in triple backticks, markdown, or code fences.
            - Do not include any extra text, explanations, or greetings outside the JSON.
            - Ensure the JSON is parsable and uses double quotes for keys and strings.

            Expected JSON Schema:
            {
            "excerpt": "string",
            "summarisedStory": "string",
            "analysisData": {
                "sentiment": "positive|neutral|negative",
                "keywords": ["string"]
                }
            }

            Here is the article to analyze:
            Title: "{{title}}"
            Body: "{{body}}"`;

        const aiResponse = await this.generate(prompt);

        let parsed;

        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                parsed = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON object found in response');
            }
        } catch (error: any) {
            this.logger.error(`Ollama JSON parse error for article: ${title}`, error.stack);
            throw new Error(`${error.message}`);
        }

        return {
            excerpt: parsed.excerpt,
            summarisedStory: parsed.summarisedStory,
            analysisData: {
                wordCount,
                readingTimeMinutes,
                sentiment: parsed.analysisData.sentiment,
                keywords: parsed.analysisData.keywords,
                generatedAt,
            },
        };
    }
}
