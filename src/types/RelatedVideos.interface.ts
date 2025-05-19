export interface RelatedVideo {
  id: string;
  title: string;
  thumbnail_url: string | null;
  created_at: string;
  views: number;
  branch?: string;
  class?: string;
  subject?: string;
  teacher: {
    id: string;
    first_name: string;
    last_name?: string;
    profile_url: string | null;
  };
}
