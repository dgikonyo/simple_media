import apiClient from './client.service'

export const baseService = {
  get: <T>(url: string, params?: object) => apiClient.get<T>(url, { params }),
  post: <T>(url: string, data?: any) => apiClient.post<T>(url, data),
  put: <T>(url: string, data?: any) => apiClient.put<T>(url, data),
  patch: <T>(url: string, data?: any) => apiClient.patch<T>(url, data),
  delete: <T>(url: string) => apiClient.delete<T>(url),
}
