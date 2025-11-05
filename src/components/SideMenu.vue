<template>
  <div class="side-menu">
    <!-- Logo -->
    <div class="logo">
      <div class="logo-icon">📹</div>
      <transition name="fade">
        <span v-if="!collapsed" class="logo-text">VideoFlow</span>
      </transition>
    </div>

    <!-- 菜单 -->
    <n-menu
      :value="activeKey"
      :options="menuOptions"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      @update:value="handleMenuClick"
    />
  </div>
</template>

<script setup>
import { computed, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const router = useRouter();

const activeKey = computed(() => route.path);

// 简单的图标渲染函数
function renderIcon(icon) {
  return () => h('span', { class: 'menu-icon' }, icon);
}

const menuOptions = computed(() => [
  {
    label: '首页',
    key: '/',
    icon: renderIcon('🏠'),
  },
  {
    label: '项目管理',
    key: '/projects',
    icon: renderIcon('📁'),
  },
  {
    label: '视频管理',
    key: '/videos',
    icon: renderIcon('🎬'),
  },
]);

function handleMenuClick(key) {
  router.push(key);
}
</script>

<style scoped>
.side-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 64px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 24px;
  flex-shrink: 0;
}

.logo-text {
  margin-left: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
}

.menu-icon {
  font-size: 18px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

