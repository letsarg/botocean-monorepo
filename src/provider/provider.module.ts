import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ChatGptService } from './chatgpt/chatgpt.service';
import { OllamaService } from './ollama/ollama.service';

@Module({
  providers: [ProviderService, ChatGptService, OllamaService]
})
export class ProviderModule { }
