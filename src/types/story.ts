export interface Author {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  storyCount?: number;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  category: StoryCategory;
  image: string;
  author: Author;
  location: string;
  slug: string;
  publishedAt: Date;
  readTime?: number;
}

export interface Category {
  id: string;
  name: StoryCategory;
  slug: string;
}

export type StoryCategory =
  | 'All'
  | 'Food & Drink'
  | 'Stay'
  | 'Transport'
  | 'Itinerary'
  | 'Adventure'
  | 'Budget Travel'
  | 'Spotlight Story';



