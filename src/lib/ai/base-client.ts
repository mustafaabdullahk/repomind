import { AIModelConfig, SummarizationRequest, SummarizationResponse } from './types';

export abstract class BaseAIClient {
  protected config: AIModelConfig;

  constructor(config: AIModelConfig) {
    this.config = config;
  }

  abstract summarizeRepository(request: SummarizationRequest): Promise<SummarizationResponse>;
} 