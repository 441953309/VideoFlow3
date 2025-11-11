import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../layout/Layout.vue';

// 路由配置
const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/projects',
    meta: {
      menu: {
        type: 'group',
        label: '创作',
        group: 'creation',
        order: 1,
      },
    },
    children: [
      {
        path: '/projects',
        name: 'projects',
        component: () => import('../pages/Projects/index.vue'),
        meta: {
          title: '项目管理',
          menu: {
            label: '创作空间',
            icon: '📁',
            order: 1,
          },
        },
      },
      {
        path: '/videos',
        name: 'videos',
        component: () => import('../pages/Videos/Videos.vue'),
        meta: {
          title: '视频管理',
          menu: {
            label: '视频管理',
            icon: '🎥',
            order: 2,
          },
        },
      },
      {
        path: '/materials',
        name: 'materials',
        component: () => import('../pages/Videos/Videos.vue'), // 临时使用，后续可替换
        meta: {
          title: '素材库',
          menu: {
            label: '素材库',
            icon: '📄',
            order: 3,
          },
        },
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('../pages/Settings/Settings.vue'),
        meta: {
          title: '软件设置',
          menu: {
            label: '软件设置',
            icon: '⚙️',
            order: 4,
          },
        },
      },
    ],
  },
  {
    path: '/tools',
    component: Layout,
    redirect: '/copywriting',
    meta: {
      menu: {
        type: 'group',
        label: '工具',
        group: 'tools',
        order: 2,
      },
    },
    children: [
      {
        path: '/copywriting',
        name: 'copywriting',
        component: () => import('../pages/Videos/Videos.vue'), // 临时使用，后续可替换
        meta: {
          title: '文案处理',
          menu: {
            label: '文案处理',
            icon: '📝',
            order: 1,
          },
        },
      },
      {
        path: '/toolbox',
        name: 'toolbox',
        component: () => import('../pages/Videos/Videos.vue'), // 临时使用，后续可替换
        meta: {
          title: '工具箱',
          menu: {
            label: '工具箱',
            icon: '🧰',
            order: 2,
          },
        },
      },
      {
        path: '/common-pages',
        name: 'common-pages',
        component: () => import('../pages/Videos/Videos.vue'), // 临时使用，后续可替换
        meta: {
          title: '常用页面',
          menu: {
            label: '常用页面',
            icon: '✈️',
            order: 3,
          },
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

