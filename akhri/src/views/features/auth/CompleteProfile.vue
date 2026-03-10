<template>
    <div class="auth-page">
        <div class="auth-box" style="max-width:28rem;">

            <div class="auth-box__title">Finish setup</div>
            <div class="auth-box__sub">A few details to complete your profile</div>

            <form @submit.prevent="submit">

                <div class="mb-3">
                    <label class="form-label">Date of Birth *</label>
                    <input type="date" class="form-control" v-model="form.dob" required />
                </div>

                <div class="mb-3">
                    <label class="form-label">Role *</label>
                    <select class="form-select" v-model="form.roleId" required>
                        <option value="" disabled>Select role</option>
                        <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label class="form-label">Country <span
                            style="color:var(--text-muted);font-weight:400;text-transform:none;">(optional)</span></label>
                    <select class="form-select" v-model="form.countryId">
                        <option value="">Select country</option>
                        <option v-for="c in countries" :key="c.id" :value="c.id">{{ c.countryName }}</option>
                    </select>
                </div>

                <p v-if="error" class="form-error">{{ error }}</p>

                <button type="submit" class="btn-dark-theme btn w-100" :disabled="loading">
                    {{ loading ? 'Saving…' : 'Complete setup' }}
                </button>

            </form>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'CompleteProfile',

    data() {
        return {
            roles: [],
            countries: [],
            form: { dob: '', roleId: '', countryId: '' },
            loading: false,
            error: null,
        };
    },

    async mounted() {
        try {
            const store = useAuthStore();
            const [roles, countries] = await Promise.all([
                store.fetchRoles(),
                store.fetchCountries(),
            ]);
            this.roles = roles;
            this.countries = countries;
        } catch (err) {
            console.error('Failed to load options:', err);
        }
    },

    methods: {
        async submit() {
            this.loading = true;
            this.error = null;
            try {
                await useAuthStore().completeProfile(this.form);
                this.$router.push('/');
            } catch (err) {
                this.error = err?.response?.data?.message ?? 'Something went wrong. Please try again.';
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>