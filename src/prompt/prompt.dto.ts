export class CreatePromptDto {
  user_id: string;
  model: ModelType;
  prompt: string;
}

export enum ModelType {
  ChatGPT4o = 'ChatGPT-4o',
  Qwen2_05b = 'qwen2:0.5b',
}