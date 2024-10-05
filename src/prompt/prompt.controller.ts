import { Body, Controller, Post } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { CreatePromptDto, ModelType } from './prompt.dto';

@Controller('prompt')
export class PromptController {
  constructor(private readonly promptService: PromptService) { }

  @Post()
  async handlePrompt(@Body() body: CreatePromptDto) {
    const { user_id, model, prompt } = body;

    // this.promptService.checkBalance()

    const result = await this.promptService.processPrompt(user_id, model, prompt);

    return result;
  }
}