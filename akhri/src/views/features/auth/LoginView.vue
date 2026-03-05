<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const handleGoogleLogin = async () => {
    try {
        await auth.signInWithGoogle();
    } catch (err: any) {
        alert('Login failed: ' + err.message);
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
            <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
                <p class="mt-2 text-sm text-gray-600">Sign in to manage your articles</p>
            </div>

            <button @click="handleGoogleLogin"
                class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5" />
                Continue with Google
            </button>

            <div class="text-center">
                <router-link to="/register" class="text-sm text-blue-600 hover:underline">
                    Don't have an account? Register here
                </router-link>
            </div>
        </div>
    </div>
</template>