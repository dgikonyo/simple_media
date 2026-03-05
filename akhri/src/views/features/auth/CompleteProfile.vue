<template>
    <div class="auth-page">
        <div class="auth-card">
            <div class="auth-card__header">
                <h2 class="auth-card__title">Complete Your Profile</h2>
                <p class="auth-card__subtitle">We need a few more details</p>
            </div>

            <form class="form" @submit.prevent="submitForm">
                <div class="form__group">
                    <label class="form__label form__label--required" for="dob">Date of Birth</label>
                    <input id="dob" class="form__input" type="date" v-model="form.dob" required />
                </div>

                <div class="form__group">
                    <label class="form__label form__label--required" for="role">Role</label>
                    <select id="role" class="form__select" v-model="form.roleId" required>
                        <option value="" disabled>Select your role</option>
                        <option v-for="role in roles" :key="role.id" :value="role.id">
                            {{ role.name }}
                        </option>
                    </select>
                </div>

                <div class="form__group">
                    <label class="form__label" for="country">Country (optional)</label>
                    <select id="country" class="form__select" v-model="form.countryId">
                        <option value="">Select your country</option>
                        <option v-for="country in countries" :key="country.id" :value="country.id">
                            {{ country.countryName }}
                        </option>
                    </select>
                </div>

                <button class="btn btn--primary btn--full" type="submit" :disabled="loading">
                    {{ loading ? 'Saving...' : 'Complete Registration' }}
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
            form: {
                dob: '',
                roleId: '',
                countryId: '',
            },
            loading: false,
        };
    },

    async mounted() {
        await this.fetchDropdowns();
    },

    methods: {
        async fetchDropdowns() {
            try {
                const authStore = useAuthStore();
                const [rolesRes, countriesRes] = await Promise.all([
                    authStore.fetchRoles(),
                    authStore.fetchCountries(),
                ]);
                this.roles = rolesRes;
                this.countries = countriesRes;
            } catch (error) {
                console.error('Failed to load roles/countries', error);
            }
        },

        async submitForm() {
            this.loading = true;
            try {
                const authStore = useAuthStore();
                await authStore.completeProfile(this.form);
                this.$router.push('/dashboard');
            } catch (error) {
                console.error('Profile completion failed', error);
                alert('Failed to save profile. Please try again.');
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>