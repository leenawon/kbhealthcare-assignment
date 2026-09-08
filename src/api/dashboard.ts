import { apiClient } from './client';
import type { DashboardResponse } from '../types/api';

export const dashboardApi = {
  getDashboard: () => apiClient.get<DashboardResponse>('/api/dashboard'),
};
