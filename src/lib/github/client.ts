import { Octokit } from '@octokit/rest';

export class GitHubClient {
  private client: Octokit;
  private static instance: GitHubClient;

  private constructor() {
    this.client = new Octokit({
      auth: process.env.GITHUB_TOKEN,
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
    } catch (error) {
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
} 