export type Priority = 'low' | 'medium' | 'high';
export type ColumnKey = 'planned' | 'inprogress' | 'done';

export interface Todo {
  id: string;
  title: string;
  description: string;
  column_name: ColumnKey;
  user_id: string;
  created_at?: string;
  priority?: Priority;
  isLoading?: boolean;
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: '#65b741',
  medium: '#539bf5',
  high: '#e5534b',
};
