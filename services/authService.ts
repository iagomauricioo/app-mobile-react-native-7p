import api from './api';
import type { GlobalResponse } from '../types/api';

export const authService = {
  login: (login: string, password: string) =>
    api.post<GlobalResponse<{ token: string }>>('/auth/login', { login, password }),
};
