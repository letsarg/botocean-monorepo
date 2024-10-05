import ollama from 'ollama';

export class OllamaService {
  async chat(content: string, context?: string) {
    const response = await ollama.chat({
      model: 'llama3.1',
      messages: [{ role: 'user', content: content }],
    });
    return response
  }
}
