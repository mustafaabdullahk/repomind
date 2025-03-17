import { Octokit } from '@octokit/rest';

export class GitHubClient {
  private client: Octokit;
  private static instance: GitHubClient | null = null;

  private constructor() {
    // Get token from localStorage if available, fallback to env var (for SSR cases)
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('github_token') || process.env.GITHUB_TOKEN
      : process.env.GITHUB_TOKEN;
      
    this.client = new Octokit({
      auth: token,
      request: {
        retries: 3,
        retryAfter: 5,
      },
    });
  }

  public static getInstance(): GitHubClient {
    if (!GitHubClient.instance) {
      GitHubClient.instance = new GitHubClient();
    }
    return GitHubClient.instance;
  }
  
  /**
   * Updates the GitHub token and recreates the client instance
   * @param token New GitHub token to use
   */
  public static updateToken(token: string): void {
    localStorage.setItem('github_token', token);
    // Reset the instance to force recreation with new token
    GitHubClient.instance = null;
    // This will recreate the client with the new token
    GitHubClient.getInstance();
  }

  public async searchRepositories(query: string, options: {
    stars?: number;
    language?: string;
    sort?: 'stars' | 'updated';
    order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  } = {}) {
    const searchQuery = this.buildSearchQuery(query, options);
    
    try {
      const response = await this.client.search.repos({
        q: searchQuery,
        sort: options.sort || 'stars',
        order: options.order || 'desc',
        per_page: options.per_page || 30,
        page: options.page || 1,
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw error;
    }
  }

  /**
   * Fetch trending repositories based on different engagement metrics
   * @param options Trending options including metric, time period, language
   * @returns Repository search results
   */
  public async getTrendingRepositories(options: {
    metric?: 'stars' | 'forks' | 'updated';
    period?: 'day' | 'week' | 'month';
    language?: string;
    per_page?: number;
    page?: number;
  } = {}) {
    const { 
      metric = 'stars',
      period = 'week',
      language,
      per_page = 10,
      page = 1
    } = options;
    
    // Calculate date range based on period
    const now = new Date();
    let dateQuery: string;
    
    switch (period) {
      case 'day':
        // Last 24 hours
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        dateQuery = `created:>${yesterday.toISOString().split('T')[0]}`;
        break;
      case 'month':
        // Last 30 days
        const lastMonth = new Date(now);
        lastMonth.setDate(now.getDate() - 30);
        dateQuery = `created:>${lastMonth.toISOString().split('T')[0]}`;
        break;
      case 'week':
      default:
        // Last 7 days
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);
        dateQuery = `created:>${lastWeek.toISOString().split('T')[0]}`;
        break;
    }
    
    // Construct query based on metric, time period, and language
    let query = dateQuery;
    
    if (language) {
      query += ` language:${language}`;
    }
    
    try {
      const response = await this.client.search.repos({
        q: query,
        sort: metric, 
        order: 'desc',
        per_page,
        page,
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw error;
    }
  }

  private buildSearchQuery(query: string, options: {
    stars?: number;
    language?: string;
  }): string {
    const parts = [query];

    if (options.stars) {
      parts.push(`stars:>=${options.stars}`);
    }

    if (options.language) {
      parts.push(`language:${options.language}`);
    }

    return parts.join(' ');
  }

  public async getRepositoryReadme(owner: string, repo: string): Promise<string> {
    try {
      const response = await this.client.repos.getReadme({
        owner,
        repo,
      });
      
      // The README is returned as base64 encoded content
      const readme = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return readme;
    } catch (error: any) {
      if (error.status === 404) {
        return 'No README file found in this repository.';
      }
      throw error;
    }
  }

  public async getRepositoryFileStructure(owner: string, repo: string): Promise<string[]> {
    try {
      const response = await this.client.repos.getContent({
        owner,
        repo,
        path: '',
      });
      
      if (Array.isArray(response.data)) {
        return response.data.map(item => `${item.type === 'dir' ? '📁' : '📄'} ${item.path}`);
      }
      
      return ['Repository content structure could not be retrieved.'];
    } catch (error) {
      console.error('Error retrieving repository structure:', error);
      return ['Repository content structure could not be retrieved.'];
    }
  }
} 