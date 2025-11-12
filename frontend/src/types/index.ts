export interface User {
  id: string;
  github_id: string;
  display_name: string;
  photo?: string;
  created_at?: string;
  last_login?: string;
}

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  column_name: 'planned' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high'; // ⬅️ Обязательное поле
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
  deadline?: string;
  position?: number;
  isLoading?: boolean;
}

export type ColumnKey = 'planned' | 'inprogress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: '#10b981', // Зелёный
  medium: '#f59e0b', // Жёлтый/Оранжевый
  high: '#ef4444', // Красный
};
