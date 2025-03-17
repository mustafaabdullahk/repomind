import OpenAI from 'openai';
import MistralClient from '@mistralai/mistralai';

export type KeyStatus = 'valid' | 'invalid' | 'limited' | 'unknown';

export async function validateOpenAIKey(apiKey: string): Promise<KeyStatus> {
  if (!apiKey) return 'invalid';
  
  try {
    const openai = new OpenAI({ 
      apiKey, 
      dangerouslyAllowBrowser: true 
    });
    
    // Make a minimal API call to check key validity
    await openai.models.list();
    return 'valid';
  } catch (error) {
    if (error.status === 401) {
      return 'invalid';
    } else if (error.status === 429) {
      return 'limited';
    }
    return 'unknown';
  }
}

export async function validateMistralKey(apiKey: string): Promise<KeyStatus> {
  if (!apiKey) return 'invalid';
  
  try {
    const mistral = new MistralClient(apiKey);
    
    // Make a minimal API call to check key validity
    await mistral.listModels();
    return 'valid';
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      return 'invalid';
    } else if (error.status === 429) {
      return 'limited';
    }
    return 'unknown';
  }
} 