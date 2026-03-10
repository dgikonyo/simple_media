import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '../assets/base.css'
import '../assets/main.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { supabase } from './lib/supabaseClient'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore(pinia)
authStore.fetchUser().finally(() => {
  app.mount('#app')
})

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  authStore.session = session;
  authStore.user = session?.user ?? null
})


