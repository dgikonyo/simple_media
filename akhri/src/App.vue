<script>
import Navbar from './components/Navbar.vue';
import { useAuthStore } from './stores/auth';

export default {
  name: 'App',
  components: { Navbar },
  mounted() {
    const authStore = useAuthStore();
    authStore.fetchUser();
  }
};
</script>

<template>
  <Navbar />
  <router-view />
</template>