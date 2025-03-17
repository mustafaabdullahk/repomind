import { useState, useEffect } from 'react';
import { GitHubClient } from '@/lib/github';
import { AIClientFactory, AIProvider, SummarizationResponse } from '@/lib/ai';
import { Repository } from '@/lib/github/types';

export function useRepositorySummary(repository: Repository | null, aiProvider: AIProvider) {
  // More explicit debugging
  console.log(`useRepositorySummary hook called with provider: ${aiProvider}`);
  
  const [summary, setSummary] = useState<SummarizationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actualProvider, setActualProvider] = useState<AIProvider>(aiProvider);
  
  // Track if the provider changes
  useEffect(() => {
    console.log(`Provider changed from ${actualProvider} to ${aiProvider}`);
    setActualProvider(aiProvider);
  }, [aiProvider]);

  useEffect(() => {
    if (!repository) return;
    
    // Very explicit logging
    console.log(`Running effect with provider: ${aiProvider}, actualProvider: ${actualProvider}`);
    
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    
    const fetchSummary = async () => {
      try {
        const githubClient = GitHubClient.getInstance();
        const [owner, repo] = repository.full_name.split('/');
        
        // Fetch README and file structure
        const readmeContent = await githubClient.getRepositoryReadme(owner, repo);
        const fileStructure = await githubClient.getRepositoryFileStructure(owner, repo);
        
        console.log(`Creating AI client for provider: ${aiProvider}`);
        // Get the AI client for the specified provider
        const aiClient = AIClientFactory.createClient(aiProvider);
        
        console.log(`Requesting summary with ${aiProvider}`);
        const summaryResponse = await aiClient.summarizeRepository({
          repositoryName: repository.full_name,
          repositoryDescription: repository.description,
          readmeContent,
          fileStructure,
        });
        
        if (isMounted) {
          setSummary(summaryResponse);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error(`Error with ${aiProvider}:`, err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to generate repository summary');
          setIsLoading(false);
        }
      }
    };

    fetchSummary();
    
    return () => {
      isMounted = false;
    };
  }, [repository, actualProvider]);

  return { summary, isLoading, error };
} 