<template>
    <nav class="navbar app-nav">
        <div class="container-fluid px-3 px-md-4">

            <!-- Brand -->
            <router-link class="navbar-brand" to="/">Newsroom</router-link>

            <!-- Center nav links (md+) -->
            <ul class="navbar-nav flex-row gap-1 d-none d-md-flex mx-auto">
                <li class="nav-item">
                    <router-link class="nav-link" to="/" exact-active-class="active">Articles</router-link>
                </li>
                <li class="nav-item" v-if="isLoggedIn">
                    <router-link class="nav-link" to="/create" active-class="active">Write</router-link>
                </li>
            </ul>

            <!-- Right controls -->
            <div class="d-flex align-items-center gap-2">

                <!-- Mobile nav links -->
                <div class="d-md-none d-flex gap-1 me-1">
                    <router-link class="nav-link py-1 px-2" to="/" exact-active-class="active"
                        style="font-size:0.8rem;font-family:sans-serif;">
                        Articles
                    </router-link>
                    <router-link v-if="isLoggedIn" class="nav-link py-1 px-2" to="/create" active-class="active"
                        style="font-size:0.8rem;font-family:sans-serif;">
                        Write
                    </router-link>
                </div>

                <!-- Theme toggle -->
                <button class="theme-btn" @click="toggleTheme" :title="isDark ? 'Light mode' : 'Dark mode'">
                    <span v-if="isDark">☀</span>
                    <span v-else>◑</span>
                </button>

                <!-- Not logged in -->
                <router-link v-if="!isLoggedIn" to="/login">
                    <button class="btn-outline-theme btn">Sign in</button>
                </router-link>

                <!-- Logged in: profile button opens offcanvas -->
                <button v-if="isLoggedIn" class="profile-btn" data-bs-toggle="offcanvas"
                    data-bs-target="#profileOffcanvas" :title="initials">
                    {{ initials }}
                </button>

            </div>
        </div>
    </nav>

    <!-- Profile Offcanvas -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="profileOffcanvas">
        <div class="offcanvas-header">
            <h6 class="offcanvas-title">Account</h6>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">

            <div class="profile-avatar">{{ initials }}</div>
            <div class="profile-name">{{ fullName }}</div>
            <div class="profile-role">{{ user?.role?.name ?? 'Member' }}</div>

            <hr>

            <div class="profile-field">
                <div class="profile-field__label">Email</div>
                <div class="profile-field__value">{{ user?.email ?? '—' }}</div>
            </div>

            <div class="profile-field">
                <div class="profile-field__label">Country</div>
                <div class="profile-field__value">
                    {{ user?.country?.country_name ?? '—' }}
                </div>
            </div>

            <div class="profile-field">
                <div class="profile-field__label">Date of Birth</div>
                <div class="profile-field__value">{{ formatDate(user?.dob) }}</div>
            </div>

            <div class="profile-field">
                <div class="profile-field__label">Member Since</div>
                <div class="profile-field__value">{{ formatDate(user?.created_at) }}</div>
            </div>

            <hr>

            <button class="btn-outline-theme btn w-100" @click="signOut">Sign out</button>

        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
    name: 'NavBar',

    data() {
        return { isDark: false };
    },

    computed: {
        authStore() { return useAuthStore(); },
        isLoggedIn() { return !!this.authStore.session; },
        user() { return this.authStore.user; },
        fullName() {
            if (!this.user) return '';
            return `${this.user.firstName ?? ''} ${this.user.lastName ?? ''}`.trim();
        },
        initials() {
            if (!this.user) return '?';
            return `${this.user.firstName?.[0] ?? ''}${this.user.lastName?.[0] ?? ''}`.toUpperCase() || '?';
        },
    },

    mounted() {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDark = saved ? saved === 'dark' : prefersDark;
        this.applyTheme();
    },

    methods: {
        toggleTheme() {
            this.isDark = !this.isDark;
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
            this.applyTheme();
        },

        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
        },

        formatDate(dateStr) {
            if (!dateStr) return '—';
            return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        },

        async signOut() {
            await this.authStore.signOut();
            this.$router.push('/');
        },
    },
};
</script>