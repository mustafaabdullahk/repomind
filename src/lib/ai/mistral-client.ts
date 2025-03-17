import { BaseAIClient } from './base-client';
import { SummarizationRequest, SummarizationResponse } from './types';

export class MistralAIClient extends BaseAIClient {
  constructor(apiKey: string, modelName = 'mistral-medium') {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('Mistral API key is required');
    }
    
    super({
      apiKey: apiKey.trim(),
      modelName,
      temperature: 0.3,
      maxTokens: 1000,
    });
  }

  async summarizeRepository(request: SummarizationRequest): Promise<SummarizationResponse> {
    try {
      const prompt = this.buildSummarizationPrompt(request);
      
      // Direct fetch API implementation to avoid library issues
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.modelName,
          messages: [
            { role: 'system', content: 'You are an AI assistant that summarizes GitHub repositories accurately and concisely.' },
            { role: 'user', content: prompt }
          ],
          temperature: this.config.temperature || 0.3,
          max_tokens: this.config.maxTokens || 1000,
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Mistral API error: ${response.status} - ${error.message || response.statusText}`);
      }
      
      const data = await response.json();
      return this.parseResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error summarizing repository with Mistral:', error);
      throw new Error(`Failed to summarize using Mistral: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildSummarizationPrompt(request: SummarizationRequest): string {
    return `
Please analyze the following GitHub repository and provide a summary:

Repository Name: ${request.repositoryName}
Description: ${request.repositoryDescription || 'No description provided'}

README Content:
${request.readmeContent.slice(0, 4000)}

${request.fileStructure ? `File Structure:
${request.fileStructure.join('\n')}` : ''}

Format your response as a JSON object with the following fields:
- summary: A concise 3-paragraph summary of the repository
- keyFeatures: An array of key features (maximum 5)
- technologiesUsed: An array of technologies used in the project
- difficultyLevel: One of "Beginner", "Intermediate", or "Advanced"
- recommendedUses: An array of recommended use cases
    `;
  }

  private parseResponse(responseText: string): SummarizationResponse {
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      return {
        summary: parsedResponse.summary || 'No summary available',
        keyFeatures: parsedResponse.keyFeatures || [],
        technologiesUsed: parsedResponse.technologiesUsed || [],
        difficultyLevel: parsedResponse.difficultyLevel,
        recommendedUses: parsedResponse.recommendedUses || [],
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        summary: 'Unable to generate summary from AI response.',
        keyFeatures: [],
        technologiesUsed: [],
        difficultyLevel: 'Intermediate',
        recommendedUses: [],
      };
    }
  }
} 