import { Injectable } from '@nestjs/common';
import { ModelType } from './prompt.dto';

@Injectable()
export class PromptService {
  async processPrompt(userId: string, model: ModelType, prompt: string) {
    if (!Object.values(ModelType).includes(model)) {
      throw new Error('Invalid model type');
    }

    const response = `Generated response for the prompt: ${prompt}`;
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
