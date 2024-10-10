import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ChatGptService } from './chatgpt/chatgpt.service';
import { OllamaService } from './ollama/ollama.service';
import { ProviderController } from './provider.controller';

@Module({
  providers: [ProviderService],
  exports: [ProviderService],
  controllers: [ProviderController],
})
export class ProviderModule { }
