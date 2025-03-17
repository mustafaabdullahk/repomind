import { BaseAIClient } from './base-client';
import { SummarizationRequest, SummarizationResponse } from './types';
import OpenAI from 'openai';

export class OpenAIClient extends BaseAIClient {
  private client: OpenAI;

  constructor(apiKey: string, modelName = 'gpt-3.5-turbo') {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('OpenAI API key is required');
    }
    
    super({
      apiKey,
      modelName,
      temperature: 0.3,
      maxTokens: 1000,
    });
    
    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async summarizeRepository(request: SummarizationRequest): Promise<SummarizationResponse> {
    try {
      const prompt = this.buildSummarizationPrompt(request);
      
      const completion = await this.client.chat.completions.create({
        model: this.config.modelName,
        messages: [
          { role: 'system', content: 'You are an AI assistant that summarizes GitHub repositories accurately and concisely.' },
          { role: 'user', content: prompt }
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      });

      return this.parseResponse(completion.choices[0].message.content || '');
    } catch (error) {
      // Check for rate limit error
      if (error.status === 429) {
        console.error('OpenAI rate limit exceeded:', error);
        throw new Error('OpenAI API quota exceeded. Please check your billing details or try using Mistral AI instead.');
      }
      console.error('Error summarizing repository with OpenAI:', error);
      throw error;
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
      // Extract JSON from the response (in case the AI included other text)
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
      // Fallback to a basic response
      return {
        summary: 'Unable to generate summary from AI response.',
        keyFeatures: [],
        technologiesUsed: [],
      };
    }
  }
} 