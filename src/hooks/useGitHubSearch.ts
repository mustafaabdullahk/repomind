import { useState, useCallback } from 'react';
import { GitHubClient } from '@/lib/github';

interface SearchOptions {
  language?: string;
  stars?: number;
  sort?: 'stars' | 'updated';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export function useGitHubSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const searchRepositories = useCallback(async (query: string, options: SearchOptions = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const client = GitHubClient.getInstance();
      const result = await client.searchRepositories(query, {
        stars: options.stars ? parseInt(options.stars as unknown as string) : undefined,
        language: options.language,
        sort: options.sort,
        order: options.order,
        per_page: options.per_page || 10,
        page: options.page || 1,
      });

      setRepositories(result.items);
      setTotalCount(result.total_count);
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to search repositories');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    searchRepositories,
    repositories,
    totalCount,
    isLoading,
    error,
  };
} 