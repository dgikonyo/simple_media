import { createRouter, createWebHistory } from 'vue-router'
import NewsView from '@/views/NewsView.vue'
import ArticleView from '@/views/features/article/ArticleView.vue'
import RegisterView from '@/views/features/auth/RegisterView.vue'
import LoginView from '@/views/features/auth/LoginView.vue'
import AuthCallbackView from '@/views/features/auth/AuthCallbackView.vue'
import { useAuthStore } from '@/stores/auth'
import CreateArticleView from '@/views/features/article/CreateArticleView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { supabase } from '@/lib/supabaseClient'
import CompleteProfile from '@/views/features/auth/CompleteProfile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/news',
    },
    {
      path: '/news',
      name: 'News',
      component: NewsView,
    },
    {
      path: '/article/:slug',
      name: 'article-detail',
      component: ArticleView,
      props: true, // Allows the slug to be passed as a prop
    },
    // --- AUTH ROUTES ---
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }, // Only logged-out users can see this
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true },
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: AuthCallbackView,
    },
    {
      path: '/write',
      name: 'write',
      component: () => CreateArticleView, // Lazy loaded
      meta: { requiresAuth: true }, // Only logged-in users can see this
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/complete-profile',
      name: 'complete-profile',
      component: () => CompleteProfile,
      meta: { requiresAuth: true },
    }
  ],
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (to.meta.requiresAuth && !session) {
    next('/login');
  } else {
    next();
  }
});

export default router
