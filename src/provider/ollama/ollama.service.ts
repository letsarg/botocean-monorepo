import ollama from 'ollama';

export class OllamaService {
  async chat(model: string, content: string, context?: string) {
    const response = await ollama.chat({
      model,
      messages: [{ role: 'user', content: content }],
    });
    return response
  }
}
