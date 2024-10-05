import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { ChatGptService } from '../provider/chatgpt/chatgpt.service';
import { OllamaService } from '../provider/ollama/ollama.service';

@Module({
  providers: [PromptService],
  controllers: [PromptController]
})
export class PromptModule {}
