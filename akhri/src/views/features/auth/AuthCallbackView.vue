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
                this.$router.push('/login');
                return;
            }

            const authStore = useAuthStore();
            const appUser = await authStore.fetchUser();

            if (!appUser) {
                this.$router.push('/login');
                return;
            }

            if (appUser.profileCompleted) {
                this.$router.push('/');
            } else {
                this.$router.push('/complete-profile');
            }
        } catch {
            this.$router.push('/login');
        }
    },
};
</script>