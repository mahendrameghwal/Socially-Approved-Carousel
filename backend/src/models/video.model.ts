// Video data model and TypeScript interfaces

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  tags: string[];
  duration: number; // in seconds
  likes: number;
  shares: number;
  views: number;
  author: {
    name: string;
    avatarUrl: string;
  };
  createdAt: string; // ISO date string
}

export interface PaginatedVideos {
  data: Video[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface LikeResponse {
  id: string;
  likes: number;
  likedByUser: boolean;
}

export interface ShareResponse {
  id: string;
  shares: number;
}

export interface ApiError {
  error: boolean;
  message: string;
  statusCode: number;
}
