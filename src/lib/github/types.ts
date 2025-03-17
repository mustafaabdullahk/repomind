export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}

export interface SearchOptions {
  stars?: number;
  language?: string;
  sort?: 'stars' | 'updated';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
} 