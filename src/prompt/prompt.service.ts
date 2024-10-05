import { Injectable } from '@nestjs/common';
import { ModelType, NewChatResDto } from './prompt.dto';
import { ProviderService } from 'src/provider/provider.service';
import { Provider } from 'src/provider/provider.dto';
import { OllamaService } from 'src/provider/ollama/ollama.service';
import { v5 as uuidv5 } from 'uuid';

@Injectable()
export class PromptService {
  private readonly UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341'; 

  private chatHistories: Map<string, string[]> = new Map();

  constructor(
    private providerService: ProviderService,
  ) {
    // mock providers
    const provider: Provider = {
      id: "hehe",
      model: ModelType.Qwen2_05b,
    };
    this.providerService.registerProvider(provider)
  }

  async newChat(user_id: string, model: ModelType): Promise<NewChatResDto> {
    // Create a new chat ID using UUID v5
    const chatId = uuidv5(`${user_id}-${model}`, this.UUID_NAMESPACE);

    // Initialize an empty array of chat messages for this chat
    this.chatHistories.set(chatId, []);

    const response: NewChatResDto = {
      chat_id: chatId,
    };
    return response;
  }

  async processPrompt(userId: string, model: ModelType, prompt: string) {
    if (!Object.values(ModelType).includes(model)) {
      throw new Error('Invalid model type');
    }

    let providers = this.providerService.findProvidersByModel(model);
    if (providers.length == 0) {
      throw new Error('No providers for model found');
    }

    // take the first
    let provider = providers[0];
    let response;
    switch (provider.model) {
      case ModelType.Qwen2_05b:
        let chatService = new OllamaService();
        let res = await chatService.chat(provider.model, prompt);
        response = res.message
        break;
      default:
        break;
    }

    const tokenCount = this.calculateTokenCount(prompt);
    const tokenPrice = this.calculateTokenPrice(tokenCount);

    return {
      user_id: userId,
      model: model,
      prompt: prompt,
      response: response,
      token_count: tokenCount,
      token_price: tokenPrice,
    };
  }

  private calculateTokenCount(prompt: string): number {
    // Example calculation for token count (could be based on prompt length)
    return prompt.length; // Simple assumption: 1 token per character
  }

  private calculateTokenPrice(tokenCount: number): number {
    // Example calculation for token price
    const pricePerToken = 0.0005; // Adjust this price per token as needed
    return tokenCount * pricePerToken;
  }
}
