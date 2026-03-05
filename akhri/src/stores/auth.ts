import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { baseService } from '@/api/base.service'
import type { UserEntity, RegisterUserDto, GetRoleDto, GetCountryDto, Country, Role } from '@/api/services/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  async function signInWithGoogle() {
    loading.value = true
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback', },
    });
    if (error) console.error(error)
    loading.value = false
  }

  async function checkUserExists(): Promise<UserEntity> {
    const { data } = await baseService.get<UserEntity>('/users/me');
    return data;
  }

  async function registerUser(registrationData: RegisterUserDto) {
    const response = await baseService.post<UserEntity>('/users/register', { id: user.value?.id, ...registrationData });
    return response.data;
  }

  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
  }

  // Fetch user from session
  async function fetchUser() {
    const { data: { user: sessionUser }, } = await supabase.auth.getUser()
    user.value = sessionUser
  }

  async function fetchCountries() {
    const response = await baseService.get<Country[]>('/countries');
    return response.data;
  }

  async function fetchRoles(getRoleDto: GetRoleDto) {
    const response = await baseService.get<Role[]>('/roles');
    return response.data;
  }

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  }

  async function completeProfile(completeUserDto: RegisterUserDto) {
    const response = await baseService.post<UserEntity>('/users/complete-profile', completeUserDto);
    return response.data;
  }

  // Initialize user on store creation
  fetchUser();

  return { user, loading, signInWithGoogle, signOut, fetchUser, getToken, checkUserExists, registerUser, fetchCountries, fetchRoles, completeProfile }
});
