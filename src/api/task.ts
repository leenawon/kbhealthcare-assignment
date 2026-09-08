import { apiClient } from './client';
import type { DeleteTaskResponse, TaskDetailResponse, TaskListResponse } from '../types/api';

export const taskApi = {
  getTasks: (page: number) =>
    apiClient.get<TaskListResponse>(`/api/task?page=${page}`),

  getTask: (id: string) =>
    apiClient.get<TaskDetailResponse>(`/api/task/${id}`),

  deleteTask: (id: string) =>
    apiClient.delete<DeleteTaskResponse>(`/api/task/${id}`),
};
