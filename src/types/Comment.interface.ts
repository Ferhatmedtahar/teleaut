export interface Comment {
  readonly id: string;
  readonly content: string;
  readonly created_at: string;
  readonly is_pinned: boolean;
  readonly user: {
    id: string;
    first_name: string;
    last_name?: string;
    profile_url: string | null;
  };
}
