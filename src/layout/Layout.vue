<template>
  <n-config-provider :theme="darkTheme">
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
        class="sidebar"
      >
        <SideMenu :collapsed="collapsed" @update:collapsed="collapsed = $event" />
      </n-layout-sider>

      <!-- 右侧内容区 -->
      <n-layout class="main-layout">
        <!-- 顶部导航栏 -->
        <n-layout-header bordered class="header">
          <div class="header-content">
            <div class="header-left">
              <div class="app-title">画字字动画</div>
            </div>
            <div class="header-center">
              <n-input
                v-model:value="searchText"
                placeholder="在使用文档中搜索..."
                class="search-input"
                clearable
              >
                <template #prefix>
                  <span style="font-size: 16px;">🔍</span>
                </template>
              </n-input>
              <div class="date-filters">
                <n-button
                  v-for="date in dateFilters"
                  :key="date"
                  size="small"
                  type="tertiary"
                  class="date-filter-btn"
                >
                  <template #icon>
                    <span style="font-size: 14px;">💡</span>
                  </template>
                  {{ date }}
                </n-button>
              </div>
            </div>
            <div class="header-right">
              <n-button type="tertiary" class="vip-btn">
                <template #icon>
                  <span style="font-size: 16px;">👑</span>
                </template>
                VIP会员
              </n-button>
              <n-avatar
                :size="32"
                round
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                class="user-avatar"
              />
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
  </n-config-provider>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { darkTheme } from 'naive-ui';
import SideMenu from './SideMenu.vue';

const route = useRoute();
const collapsed = ref(false);
const searchText = ref('');
const dateFilters = ref(['11月10日', '11月5日']);

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
  background: #1a1a1a;
}

.sidebar {
  background: #1e1e1e !important;
}

.main-layout {
  background: #1a1a1a;
}

.header {
  height: 64px;
  padding: 0 24px;
  background: #1e1e1e !important;
  border-bottom: 1px solid #2d2d2d !important;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  gap: 24px;
}

.header-left {
  display: flex;
  align-items: center;
}

.app-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.header-center {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 600px;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.date-filters {
  display: flex;
  gap: 8px;
}

.date-filter-btn {
  color: #a0a0a0;
}

.date-filter-btn:hover {
  color: #fff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.vip-btn {
  color: #ffd700;
}

.vip-btn:hover {
  color: #ffed4e;
}

.user-avatar {
  cursor: pointer;
}

.main-content {
  padding: 0;
  background: #1a1a1a;
  overflow-y: auto;
}

.content-wrapper {
  min-height: calc(100vh - 64px);
  background: #1a1a1a;
}
</style>

