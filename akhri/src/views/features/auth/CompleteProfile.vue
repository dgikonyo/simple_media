<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl border-2 border-blue-100">
            <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900">Complete Your Profile</h2>
                <p class="mt-2 text-sm text-gray-600">We need a few more details</p>
            </div>

            <form @submit.prevent="submitForm" class="mt-8 space-y-6">
                <!-- Date of Birth -->
                <div>
                    <label for="dob" class="block text-sm font-medium text-gray-700">Date of Birth *</label>
                    <input type="date" id="dob" v-model="form.dob" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>

                <!-- Role -->
                <div>
                    <label for="role" class="block text-sm font-medium text-gray-700">Role *</label>
                    <select id="role" v-model="form.roleId" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="" disabled>Select your role</option>
                        <option v-for="role in roles" :key="role.id" :value="role.id">
                            {{ role.name }}
                        </option>
                    </select>
                </div>

                <!-- Country -->
                <div>
                    <label for="country" class="block text-sm font-medium text-gray-700">Country (optional)</label>
                    <select id="country" v-model="form.countryId"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select your country</option>
                        <option v-for="country in countries" :key="country.id" :value="country.id">
                            {{ country.countryName }}
                        </option>
                    </select>
                </div>

                <div>
                    <button type="submit" :disabled="loading"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                        {{ loading ? 'Saving...' : 'Complete Registration' }}
                    </button>
                </div>
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

                const rolesRes = await authStore.fetchRoles();
                const countriesRes = await authStore.fetchCountries();

                this.roles = rolesRes;
                this.countries = countriesRes;

                console.info('Fetched roles and countries', {
                    rolesCount: this.roles.length,
                    countriesCount: this.countries.length,
                });
            } catch (error) {
                console.error('Failed to load roles/countries', error);
                // Optionally display user-friendly error
            }
        },
        async submitForm() {
            this.loading = true;
            try {
                const authStore = useAuthStore();

                const response = await authStore.completeProfile(this.form);

                console.info('Profile completed successfully', response);
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