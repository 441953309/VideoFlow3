<template>
  <div class="side-menu">
    <!-- Logo -->
    <div class="logo">
      <div class="logo-icon">📹</div>
      <transition name="fade">
        <span v-if="!collapsed" class="logo-text">画字字动画</span>
      </transition>
    </div>

    <!-- 菜单 -->
    <div class="menu-container">
      <!-- 创作 -->
      <div class="menu-section">
        <div v-if="!collapsed" class="section-title">创作</div>
        <n-menu
          :value="activeKey"
          :options="creationMenuOptions"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          @update:value="handleMenuClick"
          class="menu"
        />
      </div>

      <!-- 工具 -->
      <div class="menu-section">
        <div v-if="!collapsed" class="section-title">工具</div>
        <n-menu
          :value="activeKey"
          :options="toolsMenuOptions"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          @update:value="handleMenuClick"
          class="menu"
        />
      </div>

      <!-- 我的 -->
      <div class="menu-section">
        <div v-if="!collapsed" class="section-title">我的</div>
        <n-menu
          :value="activeKey"
          :options="myMenuOptions"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          @update:value="handleMenuClick"
          class="menu"
        />
      </div>
    </div>

    <!-- 收起按钮 -->
    <div class="collapse-btn" @click="toggleCollapse">
      <span v-if="collapsed">→</span>
      <span v-else>← 收起</span>
    </div>
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

const emit = defineEmits(['update:collapsed']);

const route = useRoute();
const router = useRouter();

const activeKey = computed(() => route.path);

// 图标渲染函数
function renderIcon(icon) {
  return () => h('span', { class: 'menu-icon' }, icon);
}

const creationMenuOptions = computed(() => [
  {
    label: '创作空间',
    key: '/home',
    icon: renderIcon('📁'),
  },
  {
    label: '当前作品',
    key: '/projects',
    icon: renderIcon('✏️'),
  },
  {
    label: '素材库',
    key: '/materials',
    icon: renderIcon('📄'),
  },
  {
    label: '软件设置',
    key: '/settings',
    icon: renderIcon('⚙️'),
  },
]);

const toolsMenuOptions = computed(() => [
  {
    label: '文案处理',
    key: '/copywriting',
    icon: renderIcon('📝'),
  },
  {
    label: '工具箱',
    key: '/toolbox',
    icon: renderIcon('🧰'),
  },
  {
    label: '常用页面',
    key: '/common-pages',
    icon: renderIcon('✈️'),
  },
]);

const myMenuOptions = computed(() => [
  {
    label: '会员权益',
    key: '/membership',
    icon: renderIcon('💎'),
  },
  {
    label: '共享云空间',
    key: '/cloud',
    icon: renderIcon('☁️'),
  },
  {
    label: '专属客服',
    key: '/customer-service',
    icon: renderIcon('💬'),
  },
]);

function handleMenuClick(key) {
  router.push(key);
}

function toggleCollapse() {
  emit('update:collapsed', !props.collapsed);
}
</script>

<style scoped>
.side-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  color: #fff;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 64px;
  padding: 0 16px;
  border-bottom: 1px solid #2d2d2d;
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
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
}

.menu-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.menu-section {
  margin-bottom: 24px;
}

.section-title {
  padding: 8px 16px;
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.menu {
  background: transparent !important;
}

.menu-icon {
  font-size: 18px;
  margin-right: 8px;
}

.menu :deep(.n-menu-item) {
  color: #ccc;
}

.menu :deep(.n-menu-item--selected) {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

.menu :deep(.n-menu-item:hover) {
  background: rgba(255, 255, 255, 0.05);
}

.collapse-btn {
  padding: 16px;
  border-top: 1px solid #2d2d2d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  transition: color 0.2s;
}

.collapse-btn:hover {
  color: #fff;
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

