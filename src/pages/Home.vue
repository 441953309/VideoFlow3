<template>
  <div class="home-page">
    <n-card title="欢迎使用 VideoFlow">
      <n-space vertical :size="16">
        <n-text>VideoFlow 是一个视频管理应用</n-text>
        <n-divider />
        <n-list>
          <n-list-item>
            <n-thing title="项目管理">
              <template #description>
                创建和管理您的项目
              </template>
            </n-thing>
          </n-list-item>
          <n-list-item>
            <n-thing title="视频管理">
              <template #description>
                管理和组织您的视频文件
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
// 首页组件
</script>

<style scoped>
.home-page {
  padding: 0;
}
</style>

