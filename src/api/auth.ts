import { apiClient } from './client';
import type { AuthTokenResponse, SignInRequest } from '../types/api';

export const authApi = {
  signIn: (body: SignInRequest) =>
    apiClient.post<AuthTokenResponse>('/api/sign-in', body),

  refresh: () =>
    apiClient.postPublic<AuthTokenResponse>('/api/refresh', {}),
};
