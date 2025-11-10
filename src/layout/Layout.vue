<template>
  <n-layout has-sider class="app-layout">
    <!-- 左侧菜单栏 -->
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <SideMenu :collapsed="collapsed" />
    </n-layout-sider>

    <!-- 右侧内容区 -->
    <n-layout>
      <!-- 顶部导航栏 -->
      <n-layout-header bordered class="header">
        <div class="header-content">
          <div class="header-title">
            <h2>{{ pageTitle }}</h2>
          </div>
          <div class="header-actions">
            <!-- 可以在这里添加用户信息、设置等 -->
          </div>
        </div>
      </n-layout-header>

      <!-- 主要内容区 -->
      <n-layout-content class="main-content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import SideMenu from './SideMenu.vue';

const route = useRoute();
const collapsed = ref(false);

// 获取当前激活路由的 meta 信息（优先使用子路由的 meta）
const pageTitle = computed(() => {
  const matched = route.matched;
  // 从最后一个匹配的路由开始查找，找到第一个有 title 的路由
  for (let i = matched.length - 1; i >= 0; i--) {
    if (matched[i].meta?.title) {
      return matched[i].meta.title;
    }
  }
  return 'VideoFlow';
});
</script>

<style scoped>
.app-layout {
  height: 100vh;
}

.header {
  height: 64px;
  padding: 0 24px;
  background: #fff;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.main-content {
  padding: 24px;
  background: #f5f5f5;
}

.content-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  min-height: calc(100vh - 112px);
}
</style>

