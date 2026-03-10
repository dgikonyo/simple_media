import axios from 'axios'
import { supabase } from '../../lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
})

/* The `apiClient.interceptors.request.use(` method is setting up a request interceptor for the Axios
instance named `apiClient`. This interceptor will be triggered for all outgoing requests made using the
Axios instance before the request is sent. */
apiClient.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const authStore = useAuthStore();
    authStore.user = session?.user ?? null;
    return config;
  },
  (error) => Promise.reject(error),
)

// Global response interceptor to handle 401
/* The `apiClient.interceptors.response.use(` method is setting up a response interceptor for the Axios
instance named `apiClient`. This interceptor will be triggered for all responses received from outgoing
requests made using the Axios instance. */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Attempt to refresh the session
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

      if (!refreshError && session) {
        // Update the failed request's Authorization header with new token
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        // Retry the request
        return apiClient(originalRequest);
      }

      // If refresh fails, sign out and redirect to login
      const authStore = useAuthStore();
      await authStore.signOut();
      // Optionally redirect to login page
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default apiClient
