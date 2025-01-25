import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requireGuest, requireAdmin } from './guards'
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
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/auth/callback',
      name: 'authCallback',
      component: () => import('@/views/auth/CallbackView.vue'),
    },
    {
      path: '/admin/users',
      name: 'userManagement',
      component: () => import('@/views/admin/UserManagementView.vue'),
      beforeEnter: requireAdmin,
    },
  ],
})

export default router
