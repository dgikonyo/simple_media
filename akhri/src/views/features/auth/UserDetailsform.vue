<template>
    <form @submit.prevent="submitRegistration">
        <input v-model="form.first_name" placeholder="First Name" required />
        <input v-model="form.last_name" placeholder="Last Name" required />
        <input v-model="form.email" type="email" placeholder="Email" required readonly :value="userEmail" />
        <input v-model="form.dob" type="date" required />
        <select v-model="form.country_id">
            <option v-for="country in countries" :key="country.id" :value="country.id">
                {{ country.country_name }}
            </option>
        </select>
        <select v-model="form.role_id" required>
            <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
            </option>
        </select>
        <button type="submit">Complete Registration</button>
    </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import apiClient from '@/services/apiClient';
import { useUserRegistration } from '@/composables/useUserRegistration';

const router = useRouter();
const { registerUser } = useUserRegistration();
const countries = ref([]);
const roles = ref([]);
const userEmail = ref('');

const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    dob: '',
    country_id: null,
    role_id: null,
});

// Fetch countries and roles from backend (or hardcode if static)
const fetchOptions = async () => {
    const [countriesRes, rolesRes] = await Promise.all([
        apiClient.get('/countries'), // you need to create these endpoints
        apiClient.get('/roles'),
    ]);
    countries.value = countriesRes.data;
    roles.value = rolesRes.data;
};

// Get user email from Supabase session
onMounted(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        userEmail.value = session.user.email;
        form.value.email = session.user.email;
    }
    await fetchOptions();
});

const submitRegistration = async () => {
    try {
        await registerUser(form.value);
        router.push('/profile'); // or wherever
    } catch (error) {
        console.error('Registration failed', error);
    }
};
</script>