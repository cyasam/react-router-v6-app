export type ContactRecord = {
  id: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  address?: string;
  notes?: string;
  favorite?: boolean;
  createdAt: number;
};
