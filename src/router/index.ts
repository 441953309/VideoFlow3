import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../pages/Project.vue'),
    meta: {
      title: '项目管理',
    },
  },
  {
    path: '/videos',
    name: 'videos',
    component: () => import('../pages/Videos.vue'),
    meta: {
      title: '视频管理',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFound.vue'),
    meta: {
      title: '页面未找到',
    },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫：设置页面标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - VideoFlow`;
  }
  next();
});

export default router;

