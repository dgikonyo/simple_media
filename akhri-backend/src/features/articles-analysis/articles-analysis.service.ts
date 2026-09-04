import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';

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
        this.logger.log(`Creating article: title="${prompt}""`);

        try {
            if (this.ollamaUrl === null) {
                throw Error('Ollama URL not provided');
            } else if (this.ollamaModel === null) {
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
            this.logger.error(`Ollama API error: prompt="${prompt}"`, error.stack);
            throw new Error(` ${error.message}`);
        }
    }
}
