import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { ProviderModule } from 'src/provider/provider.module';
import { ProviderService } from 'src/provider/provider.service';

@Module({
  providers: [PromptService, ProviderService],
  controllers: [PromptController],
  imports: [ProviderModule],
})
export class PromptModule { }
