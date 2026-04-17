import { createRouter, createWebHistory } from 'vue-router'
import { authStorage } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('../pages/LoginPage.vue'),
    },
    {
      path: '/',
      component: () => import('../layouts/AdminLayout.vue'),
      children: [
        { path: '', redirect: '/products' },
        { path: 'banners', component: () => import('../pages/BannersPage.vue') },
        { path: 'home-categories', component: () => import('../pages/HomeCategoriesPage.vue') },
        { path: 'products', component: () => import('../pages/ProductsPage.vue') },
        { path: 'stores',   component: () => import('../pages/StoresPage.vue') },
        { path: 'orders',   component: () => import('../pages/OrdersPage.vue') },
      ],
    },
  ],
})

router.beforeEach((to) => {
  if (to.path === '/login') return true
  const token = authStorage.getToken()
  if (!token) return `/login?redirect=${to.fullPath}`
  return true
})

export default router
