import { Body, Controller, Post } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { CreatePromptDto, NewChatDto, NewChatResDto } from './prompt.dto';

@Controller('prompt')
export class PromptController {
  constructor(private readonly promptService: PromptService) { }

  @Post('newChat')
  async newChat(@Body() body: NewChatDto): Promise<NewChatResDto> {
    const { user_id, model } = body;
    return this.promptService.newChat(user_id, model);
  }

  @Post('ask')
  async ask(@Body() body: CreatePromptDto) {
    let { user_id, chat_id, model, prompt } = body;

    // this.promptService.checkBalance()

    if (!chat_id) {
      const newChat = await this.promptService.newChat(user_id, model);
      chat_id = newChat.chat_id;
    }

    const result = await this.promptService.processPrompt(user_id, chat_id, model, prompt);

    return result;
  }
}