<template>
  <div class="home-page">
    <div class="home-layout">
      <!-- 主内容区 -->
      <div class="main-content">
        <!-- 横幅轮播 -->
        <div class="banner-section">
          <div class="banner">
            <div class="banner-image">
              <div class="banner-overlay">
                <div class="banner-content">
                  <h2 class="banner-title">字字动画 更新日志</h2>
                  <ul class="banner-features">
                    <li>界面迭代升级</li>
                    <li>热门视频一键克隆</li>
                    <li>适配ComfyUI工作流</li>
                    <li>共享云空间同步配置</li>
                    <li>角色配置能力升级</li>
                    <li>更多内容双击前往更新日志</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="banner-dots">
              <span class="dot active"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>

        <!-- 作品区域 -->
        <div class="works-section">
          <div class="works-header">
            <h2 class="works-title">作品 ({{ projects.length }})</h2>
            <n-button type="primary" class="create-btn" @click="createProject">
              <template #icon>
                <span>💡</span>
              </template>
              创建新作品
            </n-button>
          </div>
          <div class="works-toolbar">
            <n-button type="tertiary" size="small">
              <template #icon>
                <span>🔍</span>
              </template>
            </n-button>
            <n-button type="tertiary" size="small">
              <template #icon>
                <span>🔀</span>
              </template>
            </n-button>
            <n-button type="tertiary" size="small">任务队列</n-button>
            <n-button type="tertiary" size="small">最近删除</n-button>
          </div>
          <div class="works-grid">
            <div
              v-for="project in projects"
              :key="project.projectId"
              class="work-card"
              @click="viewProject(project.projectId)"
            >
              <div class="work-label">视频</div>
              <div class="work-thumbnail">
                <div class="work-placeholder">📹</div>
              </div>
              <div class="work-info">
                <div class="work-date">{{ formatDate(project.created_at) }}</div>
                <div class="work-progress">0/0</div>
                <div class="work-date-secondary">{{ formatDate(project.updated_at) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧热门视频栏 -->
      <div class="popular-sidebar">
        <h3 class="popular-title">热门视频 🔥</h3>
        <div class="popular-grid">
          <div
            v-for="(video, index) in popularVideos"
            :key="index"
            class="popular-card"
          >
            <div class="popular-thumbnail">
              <div class="popular-placeholder">🎬</div>
            </div>
            <div class="popular-info">
              <div class="popular-name">{{ video.title }}</div>
              <div class="popular-stats">
                <span class="stat-item">
                  <span class="stat-icon">❤️</span>
                  {{ video.likes }}
                </span>
                <span class="stat-item">
                  <span class="stat-icon">👁️</span>
                  {{ video.views }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '../../stores/project';

const router = useRouter();
const projectStore = useProjectStore();

const projects = computed(() => projectStore.allProjects);

const popularVideos = ref([
  { title: '酒后表白女老板', likes: '4.3k', views: '1.1k' },
  { title: '首富女友我的替身', likes: '3.2k', views: '2.5k' },
  { title: '慕容学叶天凡', likes: '2.8k', views: '1.8k' },
  { title: '震惊三观的妻子', likes: '5.1k', views: '3.2k' },
]);

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

function createProject() {
  router.push('/projects');
}

function viewProject(projectId) {
  router.push(`/projects/${projectId}`);
}

onMounted(async () => {
  await projectStore.loadProjects();
});
</script>

<style scoped>
.home-page {
  padding: 0;
  height: 100%;
  background: #1a1a1a;
  color: #fff;
}

.home-layout {
  display: flex;
  height: 100%;
  gap: 0;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.banner-section {
  margin-bottom: 32px;
}

.banner {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.banner-image {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.banner-overlay {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 50%;
  background: rgba(0, 0, 0, 0.3);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.banner-content {
  color: #fff;
}

.banner-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fff;
}

.banner-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.banner-features li {
  padding: 8px 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  padding-left: 20px;
}

.banner-features li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #fff;
}

.banner-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.2s;
}

.dot.active {
  background: #fff;
}

.works-section {
  margin-top: 32px;
}

.works-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.works-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.create-btn {
  background: #00bcd4;
  border-color: #00bcd4;
}

.create-btn:hover {
  background: #00acc1;
  border-color: #00acc1;
}

.works-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.work-card {
  background: #1e1e1e;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.work-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border-color: #00bcd4;
}

.work-label {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #ff4d4f;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1;
}

.work-thumbnail {
  width: 100%;
  height: 150px;
  background: #2d2d2d;
  display: flex;
  align-items: center;
  justify-content: center;
}

.work-placeholder {
  font-size: 48px;
}

.work-info {
  padding: 12px;
  color: #ccc;
  font-size: 12px;
}

.work-date {
  margin-bottom: 4px;
  color: #888;
}

.work-progress {
  margin: 8px 0;
  color: #00bcd4;
  font-weight: 500;
}

.work-date-secondary {
  color: #666;
}

.popular-sidebar {
  width: 280px;
  background: #1e1e1e;
  border-left: 1px solid #2d2d2d;
  padding: 24px;
  overflow-y: auto;
}

.popular-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 20px 0;
}

.popular-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.popular-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.popular-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-color: #00bcd4;
}

.popular-thumbnail {
  width: 100%;
  height: 120px;
  background: #2d2d2d;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popular-placeholder {
  font-size: 36px;
}

.popular-info {
  padding: 12px;
}

.popular-name {
  font-size: 14px;
  color: #fff;
  margin-bottom: 8px;
  font-weight: 500;
}

.popular-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #888;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  font-size: 14px;
}
</style>
