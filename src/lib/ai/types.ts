export interface SummarizationRequest {
  repositoryName: string;
  repositoryDescription: string | null;
  readmeContent: string;
  fileStructure?: string[];
}

export interface SummarizationResponse {
  summary: string;
  keyFeatures: string[];
  technologiesUsed: string[];
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  recommendedUses?: string[];
}

export interface AIModelConfig {
  apiKey: string;
  modelName: string;
  temperature?: number;
  maxTokens?: number;
} 