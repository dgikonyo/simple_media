<template>
    <div class="auth-page">
        <div class="auth-card">
            <div class="auth-card__header">
                <h2 class="auth-card__title">Welcome Back</h2>
                <p class="auth-card__subtitle">Sign in to continue to your account</p>
            </div>

            <button class="btn btn--primary btn--full" @click="handleSignIn">
                Sign in with Google
            </button>

            <div class="auth-card__footer">
                <router-link to="/register">Don't have an account? Sign up</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'LoginView',

    methods: {
        handleSignIn() {
            const authStore = useAuthStore();
            authStore.signInWithGoogle();
        },
    },
};
</script>