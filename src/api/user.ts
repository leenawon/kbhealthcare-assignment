import { apiClient } from './client';
import type { UserResponse } from '../types/api';

export const userApi = {
  getUser: () => apiClient.get<UserResponse>('/api/user'),
};
