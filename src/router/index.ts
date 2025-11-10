import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Layout from '../layout/Layout.vue';

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/projects',
    children: [
      {
        path: '/projects',
        name: 'projects',
        component: () => import('../pages/Projects/index.vue'),
        meta: {
          title: '项目管理',
        },
      },
      {
        path: '/videos',
        name: 'videos',
        component: () => import('../pages/Videos/Videos.vue'),
        meta: {
          title: '视频管理',
        },
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('../pages/Settings/Settings.vue'),
        meta: {
          title: '软件设置',
        },
      },
    ],
  },
  {
    path: '/projects/:id',
    name: 'project-detail',
    component: () => import('../pages/ProjectDetail/ProjectDetail.vue'),
    meta: {
      title: '项目详情',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFound/NotFound.vue'),
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

