export class CreatePromptDto {
  user_id: string;
  model: ModelType;
  prompt: string;
}

export enum ModelType {
  ChatGPT4o = 'ChatGPT-4o',
  Gwen2_05b = 'gwen2-0.5b',
}