export type UserProps = {
  id: string;
  first_name: string;
  last_name?: string;
  role: string;
  specialties: string[];
  bio: string | null;
  background_url: string;
  profile_url: string;
};

export type SuggestionList = {
  id: string;
  first_name: string;
  last_name?: string;
  role: string;
  specialties: string[];
  bio: string | null;
  background_url: string;
  profile_url: string;
  class: string;
  branch: string;
};

export type RelatedVideoUser = {
  id: string;
  first_name: string;
  last_name?: string;
  profile_url: string | null;
};
