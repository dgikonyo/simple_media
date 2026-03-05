<template>
    <div class="callback-page">
        <div class="callback-page__spinner"></div>
        <p class="callback-page__text">Syncing your profile with the Council...</p>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/lib/supabaseClient';

export default {
    name: 'AuthCallbackView',

    async mounted() {
        try {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Auth callback error:', error);
                this.$router.push('/login?error=Authentication failed');
                return;
            }

            if (!data.session) {
                console.warn('No session after OAuth callback');
                this.$router.push('/login');
                return;
            }

            const authStore = useAuthStore();
            await authStore.fetchUser();

            try {
                const response = await authStore.checkUserExists();

                if (response.profileCompleted) {
                    console.info('Profile complete, redirecting to dashboard');
                    this.$router.push('/dashboard');
                } else {
                    console.info('Profile incomplete, redirecting to complete profile');
                    this.$router.push('/complete-profile');
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    console.warn('User not found in DB, redirecting to complete profile');
                    this.$router.push('/complete-profile');
                } else {
                    console.error('Error checking user profile:', err);
                    this.$router.push('/login?error=Unable to verify user');
                }
            }
        } catch (err) {
            console.error('Unexpected error in auth callback:', err);
            this.$router.push('/login');
        }
    },
};
</script>