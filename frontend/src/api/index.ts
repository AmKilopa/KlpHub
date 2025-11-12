import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getUser = () => api.get('/auth/user');
export const logout = () => api.get('/auth/logout');
export const getGithubLoginUrl = () => `${API_URL}/auth/github`;

export const getTasks = () => api.get('/api/todos');
export const createTask = (title: string, columnname = 'todo', description = '') =>
  api.post('/api/todos', { title, columnname, description });

export const updateTask = (id: string, updates: any) => api.patch(`/api/todos/${id}`, updates);
export const deleteTask = (id: string) => api.delete(`/api/todos/${id}`);

export const moveTask = (id: string, columnname: string) => updateTask(id, { columnname });

export default api;
