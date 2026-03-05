<template>
  <div>
    <h1>Profile</h1>
    <pre>{{ user.user_metadata }}</pre>
    <button @click="signOut">Sign Out</button>
    <!-- <button @click="fetchProtectedData">Call Protected API</button> -->
    <p>API Response: {{ apiResponse }}</p>
  </div>
</template>
<script >
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/lib/supabaseClient';

export default {
    data() {
        return {
            apiResponse: null,
        };
    },

    computed: {
        authStore() {
            return useAuthStore();
        },

        user() {
            return this.authStore.user;
        },
    },

    methods: {
        async signOut() {
            await this.authStore.signOut();
        },

        async fetchProtectedData() {
            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await res.json();
            this.apiResponse = result;
        },
    },
};
</script>