import OpenAI from 'openai';

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
  } catch (error: any) {
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
    // Make a direct API call to check key validity using fetch
    const response = await fetch('https://api.mistral.ai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      return 'valid';
    } else if (response.status === 401 || response.status === 403) {
      return 'invalid';
    } else if (response.status === 429) {
      return 'limited';
    }
    return 'unknown';
  } catch (error: any) {
    console.error('Error validating Mistral key:', error);
    return 'unknown';
  }
} 