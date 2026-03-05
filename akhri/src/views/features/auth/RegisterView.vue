<script setup lang="ts">
import { useAuthStore } from '../../../stores/auth';

const auth = useAuthStore();
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl border-2 border-blue-100">
            <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900">Create Account</h2>
                <p class="mt-2 text-sm text-gray-600">Join our community of world-class bloggers</p>
            </div>

            <div class="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                By registering, you'll get access to article analysis tools and global headlines.
            </div>

            <button @click="auth.signInWithGoogle"
                class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition">
                Sign up with Google
            </button>

            <div class="text-center">
                <router-link to="/login" class="text-sm text-gray-600 hover:underline">
                    Already have an account? Log in
                </router-link>
            </div>
        </div>
    </div>
</template>