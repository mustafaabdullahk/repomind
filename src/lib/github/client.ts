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

  public async getRepositoryReadme(owner: string, repo: string): Promise<string> {
    try {
      const response = await this.client.repos.getReadme({
        owner,
        repo,
      });
      
      // The README is returned as base64 encoded content
      const readme = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return readme;
    } catch (error) {
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