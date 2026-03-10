<template>
    <div class="auth-page">
        <div class="auth-card">
            <div class="auth-card__header">
                <h2 class="auth-card__title">Finish Registration</h2>
                <p class="auth-card__subtitle">Tell us a little about yourself</p>
            </div>

            <form class="form" @submit.prevent="submitRegistration">
                <div class="form__group">
                    <label class="form__label form__label--required" for="first_name">First Name</label>
                    <input id="first_name" class="form__input" v-model="form.first_name" placeholder="First Name"
                        required />
                </div>

                <div class="form__group">
                    <label class="form__label form__label--required" for="last_name">Last Name</label>
                    <input id="last_name" class="form__input" v-model="form.last_name" placeholder="Last Name"
                        required />
                </div>

                <div class="form__group">
                    <label class="form__label form__label--required" for="email">Email</label>
                    <input id="email" class="form__input" v-model="form.email" type="email" placeholder="Email" required
                        readonly />
                </div>

                <div class="form__group">
                    <label class="form__label form__label--required" for="dob">Date of Birth</label>
                    <input id="dob" class="form__input" v-model="form.dob" type="date" required />
                </div>

                <div class="form__group">
                    <label class="form__label" for="country_id">Country</label>
                    <select id="country_id" class="form__select" v-model="form.country_id">
                        <option value="">Select your country</option>
                        <option v-for="country in countries" :key="country.id" :value="country.id">
                            {{ country.country_name }}
                        </option>
                    </select>
                </div>

                <div class="form__group">
                    <label class="form__label form__label--required" for="role_id">Role</label>
                    <select id="role_id" class="form__select" v-model="form.role_id" required>
                        <option value="">Select your role</option>
                        <option v-for="role in roles" :key="role.id" :value="role.id">
                            {{ role.name }}
                        </option>
                    </select>
                </div>

                <button class="btn btn--primary btn--full" type="submit">
                    Complete Registration
                </button>
            </form>
        </div>
    </div>
    <Footer />
</template>

<script>
import { supabase } from '@/lib/supabaseClient';
import apiClient from '@/services/apiClient';
import { useUserRegistration } from '@/composables/useUserRegistration';
import Footer from '@/components/Footer.vue';

export default {
    name: 'RegisterUserForm',
    components: { Footer },

    data() {
        return {
            countries: [],
            roles: [],
            form: {
                first_name: '',
                last_name: '',
                email: '',
                dob: '',
                country_id: null,
                role_id: null,
            },
        };
    },

    async mounted() {
        await this.loadSessionEmail();
        await this.fetchOptions();
    },

    methods: {
        async loadSessionEmail() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                this.form.email = session.user.email;
            }
        },

        async fetchOptions() {
            try {
                const [countriesRes, rolesRes] = await Promise.all([
                    apiClient.get('/countries'),
                    apiClient.get('/roles'),
                ]);
                this.countries = countriesRes.data;
                this.roles = rolesRes.data;
            } catch (error) {
                console.error('Failed to fetch options:', error);
            }
        },

        async submitRegistration() {
            const { registerUser } = useUserRegistration();
            try {
                await registerUser(this.form);
                this.$router.push('/profile');
            } catch (error) {
                console.error('Registration failed', error);
            }
        },
    },
};
</script>