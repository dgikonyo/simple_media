<template>
    <div class="profile-page">
        <h1 class="profile-page__title">Profile</h1>
        <pre class="profile-page__data">{{ user }}</pre>
        <button class="btn btn--primary" @click="signOut">Sign Out</button>
        <p v-if="apiResponse">API Response: {{ apiResponse }}</p>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'ProfileView',

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
    },
};
</script>