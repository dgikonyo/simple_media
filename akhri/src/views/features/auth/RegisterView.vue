<template>
    <div class="auth-page">
        <div class="auth-card">
            <div class="auth-card__header">
                <h2 class="auth-card__title">Create Account</h2>
                <p class="auth-card__subtitle">Join our community of world-class bloggers</p>
            </div>

            <div class="auth-card__notice">
                By registering, you'll get access to article analysis tools and global headlines.
            </div>

            <button class="btn btn--primary btn--full" @click="handleSignIn">
                Sign up with Google
            </button>

            <div class="auth-card__footer">
                <router-link to="/login">Already have an account? Log in</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'RegisterView',

    methods: {
        handleSignIn() {
            const authStore = useAuthStore();
            authStore.signInWithGoogle();
        },
    },
};
</script>