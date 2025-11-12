import axios from 'axios';
import { Priority } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth
export const getUser = () => api.get('/auth/user');
export const logout = () => api.post('/auth/logout');
export const getGithubLoginUrl = () => `${API_BASE_URL}/auth/github`;

// Tasks
export const getTasks = () => api.get('/api/todos');
export const createTask = (title: string, column_name: string, description?: string, priority: Priority = 'medium') =>
  api.post('/api/todos', { title, column_name, description, priority });
export const updateTask = (id: string, updates: any) => 
  api.put(`/api/todos/${id}`, updates);
export const deleteTask = (id: string) => 
  api.delete(`/api/todos/${id}`);
export const moveTask = (id: string, column_name: string) =>
  api.put(`/api/todos/${id}`, { column_name });
