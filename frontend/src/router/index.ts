import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requireGuest } from './guards'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      beforeEnter: requireGuest,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      beforeEnter: requireGuest,
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      beforeEnter: requireGuest,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      beforeEnter: requireAuth,
    },
  ],
})

export default router
