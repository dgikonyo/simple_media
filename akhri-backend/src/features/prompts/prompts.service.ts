import { Injectable, NotFoundException } from '@nestjs/common';
import { Prompt } from './interfaces/prompt.interface';
import { ArticlesAnalysisService } from '../articles-analysis/articles-analysis.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { UpdatePromptDto } from './dto/update-prompt.dto';

@Injectable()
export class PromptsService {
    private prompts: Prompt[] = [];
    private readonly ollamaModel: string;

    constructor(
        private readonly articleAnalysisService: ArticlesAnalysisService,
        private readonly configService: ConfigService,) {
        this.ollamaModel = this.configService.get<string>('OLLAMA_MODEL') ?? "";
    }

    async create(createPromptDto: CreatePromptDto): Promise<Prompt> {

        const response = await this.articleAnalysisService.generate(createPromptDto.prompt);

        const newPrompt: Prompt = {
            id: randomUUID(),
            prompt: createPromptDto.prompt,
            model: this.ollamaModel,
            response: response,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.prompts.push(newPrompt);
        return newPrompt;
    }

    findAll(): Prompt[] {
        return this.prompts;
    }

    findOne(id: string): Prompt {
        const prompt = this.prompts.find((p) => p.id === id);
        if (!prompt) {
            throw new NotFoundException(`Prompt with ID ${id} not found`);
        }

        return prompt;
    }

    async update(id: string, updatePromptDto: UpdatePromptDto): Promise<Prompt> {
        const existing = this.findOne(id);

        if (updatePromptDto.prompt || updatePromptDto.model) {
            const newPromptText = updatePromptDto.prompt || existing.prompt;
            const newModel = updatePromptDto.model || existing.model;

            const newResponse = await this.articleAnalysisService.generate(newPromptText);

            existing.prompt = newPromptText;
            existing.model = newModel;
            existing.response = newResponse;
            existing.updatedAt = new Date();
        }

        return existing;
    }

    remove(id: string): { deleted: boolean } {
        const index = this.prompts.findIndex((p) => p.id === id);

        if (index === -1) {
            throw new NotFoundException(`Prompt with ID ${id} not found`);
        }
        this.prompts.splice(index, 1);

        return { deleted: true };
    }
}
