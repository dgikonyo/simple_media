<template>
    <div class="callback-page">
        <div class="spinner-ring"></div>
        <p>Signing you in…</p>
    </div>
</template>

<script>
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'AuthCallbackView',

    async mounted() {
        try {
            const { data, error } = await supabase.auth.getSession();

            if (error || !data.session) {
                this.$router.push('/login?error=Authentication failed');
                return;
            }

            const authStore = useAuthStore();
            await authStore.fetchUser();

            try {
                const response = await authStore.checkUserExists();

                if (response.profileCompleted) {
                    console.info('Profile complete, redirecting to dashboard');
                    this.$router.push('/');
                } else {
                    console.info('Profile incomplete, redirecting to complete profile');
                    this.$router.push('/complete-profile');
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    console.warn('User not found, redirecting to complete profile');
                    this.$router.push('/complete-profile');
                } else {
                    console.error('Error checking user profile:', err);
                    this.$router.push('/login?error=Unable to verify user');
                }
            }
        } catch {
            console.error('Unexpected error in auth callback:', err);
            this.$router.push('/login');
        }
    },
};
</script>