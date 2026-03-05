<template>
    <div class="h-screen bg-black flex flex-col items-center justify-center text-white">
        <div class="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-400 font-medium">Syncing your profile with the Council...</p>
    </div>
</template>

<script>
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'AuthCallback',
    async mounted() {
        const logger = console; // Replace with structured logger in production

        try {
            // Exchange OAuth code for session
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                logger.error('Auth callback error:', error);
                this.$router.push('/login?error=Authentication failed');
                return;
            }

            if (!data.session) {
                logger.warn('No session after OAuth callback');
                this.$router.push('/login');
                return;
            }

            // Update store
            const authStore = useAuthStore();
            await authStore.fetchUser();

            // Check if user exists and profile is complete
            try {
                const response = await authStore.checkUserExists();
                const profileCompleted = response.profileCompleted;

                if (profileCompleted) {
                    logger.info('Profile complete, redirecting to dashboard');
                    this.$router.push('/dashboard');
                } else {
                    logger.info('Profile incomplete, redirecting to complete profile');
                    this.$router.push('/complete-profile');
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    // User not in DB (should not happen if auto-creation works)
                    logger.warn('User not found in DB, redirecting to complete profile');
                    this.$router.push('/complete-profile');
                } else {
                    logger.error('Error checking user profile:', err);
                    this.$router.push('/login?error=Unable to verify user');
                }
            }
        } catch (err) {
            logger.error('Unexpected error in auth callback:', err);
            this.$router.push('/login');
        }
    },
};
</script>