import { useState, useCallback, useEffect } from 'react';
import { GitHubClient } from '@/lib/github';

export type TrendingMetric = 'stars' | 'forks' | 'updated';
export type TrendingPeriod = 'day' | 'week' | 'month';

interface TrendingOptions {
  metric?: TrendingMetric;
  period?: TrendingPeriod;
  language?: string;
  per_page?: number;
  page?: number;
  autoLoad?: boolean;
}

export function useTrendingRepositories(initialOptions: TrendingOptions = { autoLoad: true }) {
  const [options, setOptions] = useState({
    metric: initialOptions.metric || 'stars',
    period: initialOptions.period || 'week',
    language: initialOptions.language,
    per_page: initialOptions.per_page || 10,
    page: initialOptions.page || 1,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTrending = useCallback(async (overrideOptions?: Partial<TrendingOptions>) => {
    const currentOptions = overrideOptions ? { ...options, ...overrideOptions } : options;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const client = GitHubClient.getInstance();
      const result = await client.getTrendingRepositories({
        metric: currentOptions.metric,
        period: currentOptions.period,
        language: currentOptions.language,
        per_page: currentOptions.per_page,
        page: currentOptions.page,
      });

      setRepositories(result.items);
      setTotalCount(result.total_count);
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trending repositories');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const updateOptions = useCallback((newOptions: Partial<TrendingOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  // Auto-load trending repositories on mount if autoLoad is true
  useEffect(() => {
    if (initialOptions.autoLoad) {
      fetchTrending();
    }
  }, [fetchTrending, initialOptions.autoLoad]);

  return {
    fetchTrending,
    updateOptions,
    repositories,
    totalCount,
    isLoading,
    error,
    options,
  };
} 