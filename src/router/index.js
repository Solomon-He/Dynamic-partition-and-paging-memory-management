import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: () => import('@/views/home/HomeView.vue'),
    },
    {
      path: '/partition',
      component: () => import('@/views/partition/PartitionView.vue'),
    },
    {
      path: '/paging',
      component: () => import('@/views/paging/PagingView.vue'),
    },
  ],
})

export default router
