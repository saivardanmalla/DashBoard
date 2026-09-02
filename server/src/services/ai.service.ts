export interface MessagePayload {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenAIProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string = process.env.OPENAI_API_KEY || '', model: string = 'gpt-4o') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateCompletion(messages: MessagePayload[]): Promise<string> {
    if (!this.apiKey || this.apiKey.startsWith('sk-dummy')) {
      return 'AI Completion: Simulated smart response based on project requirements and active tasks.';
    }
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ model: this.model, messages }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No response generated.';
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey || this.apiKey.startsWith('sk-dummy')) {
      return new Array(1536).fill(0.01);
    }
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: text.slice(0, 8000) }),
    });
    const data = await res.json();
    return data.data?.[0]?.embedding || new Array(1536).fill(0);
  }
}
