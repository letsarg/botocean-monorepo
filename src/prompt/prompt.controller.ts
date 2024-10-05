import { Body, Controller, Post } from '@nestjs/common';
import { PromptService } from './prompt.service';

@Controller('prompt')
export class PromptController {
  constructor(private readonly promptService: PromptService) { }

  @Post()
  async handlePrompt(@Body() body: { user_id: string, model: string, prompt: string }) {
    const { user_id, model, prompt } = body;

    // this.promptService.checkBalance()

    const result = await this.promptService.processPrompt(user_id, model, prompt);

    return result;
  }
}