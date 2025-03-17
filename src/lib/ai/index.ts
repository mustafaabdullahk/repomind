import { OpenAIClient } from './openai-client';
import { MistralAIClient } from './mistral-client';
import { BaseAIClient } from './base-client';

export type AIProvider = 'openai' | 'mistral';

export class AIClientFactory {
  static createClient(provider: AIProvider): BaseAIClient {
    console.log("Creating AI client with provider:", provider);
    
    try {
      switch (provider) {
        case 'openai': {
          const apiKey = typeof window !== 'undefined' 
            ? localStorage.getItem('openai_api_key') || ''
            : '';
          
          if (!apiKey) {
            throw new Error('OpenAI API key not found. Please add it in Settings.');
          }
          
          return new OpenAIClient(apiKey);
        }
        case 'mistral': {
          const apiKey = typeof window !== 'undefined' 
            ? localStorage.getItem('mistral_api_key') || ''
            : '';
          
          if (!apiKey) {
            throw new Error('Mistral API key not found. Please add it in Settings.');
          }
          
          console.log("Creating Mistral client with key:", apiKey.substring(0, 3) + "...");
          return new MistralAIClient(apiKey);
        }
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }
    } catch (error) {
      console.error('Error creating AI client:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Unknown error creating AI client: ${String(error)}`);
    }
  }
  
  static getDefaultProvider(): AIProvider {
    return (typeof window !== 'undefined' && localStorage.getItem('default_ai_provider') as AIProvider) || 'openai';
  }
  
  static hasConfiguredKeys(): boolean {
    if (typeof window === 'undefined') return false;
    
    const openaiKey = localStorage.getItem('openai_api_key');
    const mistralKey = localStorage.getItem('mistral_api_key');
    
    return !!(openaiKey || mistralKey);
  }
}

export * from './types'; 