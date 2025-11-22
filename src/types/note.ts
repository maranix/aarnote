export type SortField = 'lastUpdate' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  imageUri?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  imageUri?: string;
}

export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  imageUri?: string;
}
