import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { ProviderService } from 'src/provider/provider.service';
import { ProviderModule } from 'src/provider/provider.module';

@Module({
  providers: [PromptService, ProviderService],
  controllers: [PromptController],
  imports: [ProviderModule],
})
export class PromptModule { }
