import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '../assets/base.css'
import '../assets/main.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { supabase } from './lib/supabaseClient'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  const authStore = useAuthStore()
  authStore.user = session?.user || null
})

app.mount('#app')
