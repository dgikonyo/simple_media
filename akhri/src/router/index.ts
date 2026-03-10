import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

import ArticlesView from '@/views/features/article/AllArticlesView.vue'
import AllArticlesView from '@/views/features/article/AllArticlesView.vue'
import CreateArticleView from '@/views/features/article/CreateArticleView.vue'
import LoginView from '@/views/features/auth/LoginView.vue'
import RegisterView from '@/views/features/auth//RegisterView.vue'
import AuthCallbackView from '@/views/features/auth//AuthCallbackView.vue'
import CompleteProfile from '@/views/features/auth//CompleteProfile.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // Public
  { path: '/', name: 'articles', component: AllArticlesView },
  { path: '/articles/:slug', name: 'article', component: () => import('@/views/features/article/ArticlesView.vue') },

  // Auth
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },
  { path: '/auth/callback', name: 'auth-callback', component: AuthCallbackView },
  {
    path: '/complete-profile',
    name: 'complete-profile',
    component: CompleteProfile,
    meta: { requiresAuth: true },
  },

  // Protected
  {
    path: '/create',
    name: 'create-article',
    component: CreateArticleView,
    meta: { requiresAuth: true },
  },

  // Catch-all
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  // const { data } = await supabase.auth.getSession()
  // const isLoggedIn = !!data.session
  const authStore = useAuthStore()

  // If the store isn't loaded yet (shouldn't happen after Step 2), load it
  if (!authStore.session) {
    await authStore.fetchUser()
  }
  const isLoggedIn = !!authStore.session
  console.log(`Navigating to ${to.path}, logged in: ${isLoggedIn}`)

  if (to.meta.requiresAuth && !isLoggedIn) return { name: 'login' }
  if (to.meta.guestOnly && isLoggedIn) return { name: 'articles' }
})

export default router
