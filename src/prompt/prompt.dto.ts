export class CreatePromptDto {
  user_id: string;
  model: ModelType;
  prompt: string;
}

export enum ModelType {
  ChatGPT4o = 'ChatGPT-4o',
  Ollama31_7b = 'Ollama3.1-7b',
}