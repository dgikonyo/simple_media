// src/services/customers.ts
import { baseService } from '@/api/base.service';
import type { Customer } from '../types';

export const customerService = {
  async getCurrentUser(): Promise<Customer> {
    const response = await baseService.get<Customer>('/customers/me');
    return response.data;
  },

  async updateProfile(data: Partial<Customer>): Promise<Customer> {
    const response = await baseService.patch<Customer>('/customers/me', data);
    return response.data;
  },
};