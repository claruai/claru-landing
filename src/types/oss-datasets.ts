// ---------------------------------------------------------------------------
// OSS Datasets — TypeScript types matching oss_datasets Supabase table
// ---------------------------------------------------------------------------

export interface OSSDataset {
  id: string;
  dataset_id: string;
  slug: string;
  name: string;
  description: string | null;
  parent_project: string | null;
  author: string | null;
  modalities: string[];
  robot_embodiments: string[];
  action_space: string | null;
  environment_type: string[];
  task_types: string[];
  num_episodes: string | null;
  total_hours: string | null;
  license: string | null;
  annotation_types: string[];
  data_format: string | null;
  year_released: number | null;
  paper_url: string | null;
  paper_title: string | null;
  physical_ai_relevance: string | null;
  hf_downloads: number;
  hf_likes: number;
  hf_last_modified: string | null;
  hf_tags: string[];
  // Community Signals
  citation_count: number | null;
  citing_papers_sample: CitingPaper[] | null;
  hf_discussion_count: number | null;
  hf_discussions_sample: HFDiscussion[] | null;
  reddit_posts: RedditPost[];
  hn_posts: HNPost[];
  hf_downloads_rank: string | null;
  is_active: boolean;
  is_gated: boolean;
  is_private: boolean;
  extraction_completeness: number | null;
  card_text_source: string | null;
  last_crawled_at: string | null;
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CitingPaper {
  title: string;
  year: number | null;
  venue: string;
  url: string | null;
}

export interface HFDiscussion {
  title: string;
  upvotes: number;
  url: string | null;
}

export interface RedditPost {
  title: string;
  subreddit: string;
  score: number;
  num_comments: number;
  url: string;
  created_utc: string;
}

export interface HNPost {
  title: string;
  points: number;
  num_comments: number;
  url: string;
  hn_url: string;
  created_at: string;
}

export type OSSDatasetSortOption = "downloads" | "recent" | "citations" | "name";

export interface OSSDatasetFilters {
  search: string;
  modalities: string[];
  robot_embodiments: string[];
  environment_type: string[];
  task_types: string[];
  license: string[];
  data_format: string[];
  sort: OSSDatasetSortOption;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface FilterOptions {
  modalities: FilterOption[];
  robot_embodiments: FilterOption[];
  environment_type: FilterOption[];
  task_types: FilterOption[];
  license: FilterOption[];
  data_format: FilterOption[];
}

export const DEFAULT_FILTERS: OSSDatasetFilters = {
  search: "",
  modalities: [],
  robot_embodiments: [],
  environment_type: [],
  task_types: [],
  license: [],
  data_format: [],
  sort: "downloads",
};
