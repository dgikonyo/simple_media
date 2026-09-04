import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';

@Controller('ollama/prompts')
export class PromptsController {
    constructor(private readonly promptsService: PromptsService) { }

    @Post()
    create(@Body() createPromptDto: CreatePromptDto) {
        return this.promptsService.create(createPromptDto);
    }

    @Get()
    findAll() {
        return this.promptsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.promptsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updatePromptDto: UpdatePromptDto) {
        return this.promptsService.update(id, updatePromptDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.promptsService.remove(id);
    }
}
