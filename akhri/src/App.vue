<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';

const auth = useAuthStore();

const authStore = useAuthStore();

onMounted(() => {
  authStore.fetchUser();
});
</script>

<template>
  <div class="min-h-screen bg-white font-sans text-gray-900">
    <nav class="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <router-link to="/" class="text-2xl font-black tracking-tighter">CROWD BRIEF.</router-link>

        <div class="flex items-center gap-6 text-sm font-medium">
          <router-link to="/news" class="hover:text-blue-600 transition">News</router-link>

          <template v-if="auth.user">
            <router-link to="/write"
              class="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">Write</router-link>
            <button @click="auth.signOut" class="text-red-500 hover:text-red-600">Logout</button>
          </template>

          <template v-else>
            <router-link to="/login" class="hover:text-blue-600">Sign In</router-link>
            <router-link to="/register"
              class="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">Get
              Started</router-link>
          </template>
        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>