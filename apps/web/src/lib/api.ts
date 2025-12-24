import client from './api-client';
import { Task, CreateTaskDto, UpdateTaskDto } from '@ghl-task/types';

export const authApi = {
  getAuthUrl: () => client.get<{ url: string }>('/auth/ghl/authorize'),
  handleCallback: (code: string) =>
    client.get<{ accessToken: string; user: any }>(`/auth/ghl/callback?code=${code}`),
  getCurrentUser: () => client.get('/auth/me'),
  refreshToken: () => client.get('/auth/refresh'),
};

export const organizationsApi = {
  getProfile: () => client.get('/organizations/me'),
  getMembers: () => client.get('/organizations/members'),
  syncUsers: () => client.post('/organizations/sync-users', {}),
};

export const spacesApi = {
  getAll: () => client.get('/spaces'),
  create: (data: any) => client.post('/spaces', data),
  getById: (id: string) => client.get(`/spaces/${id}`),
  update: (id: string, data: any) => client.put(`/spaces/${id}`, data),
  delete: (id: string) => client.delete(`/spaces/${id}`),
};

export const tasksApi = {
  getByList: (listId: string) => client.get<Task[]>(`/tasks/list/${listId}`),
  getById: (taskId: string) => client.get<Task>(`/tasks/${taskId}`),
  create: (data: CreateTaskDto) => client.post<Task>('/tasks', data),
  update: (taskId: string, data: UpdateTaskDto) => client.put<Task>(`/tasks/${taskId}`, data),
  delete: (taskId: string) => client.delete(`/tasks/${taskId}`),
  search: (query: string) => client.post('/tasks/search', { query }),
};

export const commentsApi = {
  getByTask: (taskId: string) => client.get(`/tasks/${taskId}/comments`),
  create: (taskId: string, data: any) => client.post(`/tasks/${taskId}/comments`, data),
  update: (taskId: string, commentId: string, data: any) =>
    client.put(`/tasks/${taskId}/comments/${commentId}`, data),
  delete: (taskId: string, commentId: string) =>
    client.delete(`/tasks/${taskId}/comments/${commentId}`),
};
