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
      <div
        v-for="group in menuGroups"
        :key="group.id"
        class="menu-section"
      >
        <div v-if="!collapsed" class="section-title">{{ group.title }}</div>
        <n-menu
          :value="activeKey"
          :options="group.items"
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

// 从路由配置中生成菜单项，按分组组织
const menuGroups = computed(() => {
  const routes = router.getRoutes();
  const groupsMap = {};

  // 遍历路由，提取分组和菜单项
  routes.forEach((route) => {
    // 检查是否是分组路由（父路由，有 type: 'group'）
    if (route.meta?.menu?.type === 'group') {
      const groupInfo = route.meta.menu;
      // 使用父路由的 group 属性作为分组 ID，如果没有则使用 label
      const parentGroupId = groupInfo.group || groupInfo.label || route.name || route.path;
      
      // 初始化父分组
      if (!groupsMap[parentGroupId]) {
        groupsMap[parentGroupId] = {
          id: parentGroupId,
          title: groupInfo.label || parentGroupId,
          order: groupInfo.order || 999,
          items: [],
        };
      }
      
      // 处理子路由
      if (route.children && route.children.length > 0) {
        route.children.forEach((childRoute) => {
          // 只处理有 menu 配置且不是分组类型的子路由
          if (childRoute.meta?.menu && childRoute.meta.menu.type !== 'group') {
            const menuInfo = childRoute.meta.menu;
            // 子路由如果没有指定 group，使用父分组；如果指定了 group，使用指定的 group
            const groupId = menuInfo.group || parentGroupId;
            
            // 如果分组不存在，创建分组（这种情况发生在子路由指定了不同的 group）
            if (!groupsMap[groupId]) {
              groupsMap[groupId] = {
                id: groupId,
                title: groupId,
                order: 999,
                items: [],
              };
            }

            // 添加菜单项
            const menuItem = {
              label: menuInfo.label,
              key: childRoute.path,
              icon: renderIcon(menuInfo.icon),
              order: menuInfo.order || 999,
            };
            groupsMap[groupId].items.push(menuItem);
          }
        });
      }
    }
  });

  // 按分组 order 排序，然后按菜单项 order 排序
  const sortedGroups = Object.values(groupsMap)
    .map((group) => ({
      ...group,
      items: group.items.sort((a, b) => a.order - b.order),
    }))
    .filter((group) => group.items.length > 0) // 只显示有菜单项的分组
    .sort((a, b) => a.order - b.order);

  return sortedGroups;
});

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

