<template>
  <div class="project-page">
    <div class="project-layout">
      <!-- 主内容区 -->
      <div class="main-content">
        <!-- 页面标题和操作栏 -->
        <div class="page-header">
          <h1 class="page-title">项目管理</h1>
          <div class="header-actions">
            <n-button type="primary" class="create-btn" @click="showCreateModal = true">
              <template #icon>
                <span>💡</span>
              </template>
              创建新项目
            </n-button>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- 项目列表 -->
        <div v-if="loading" class="loading-state">
          <n-spin size="large" />
        </div>
        <div v-else-if="projects.length === 0" class="empty-state">
          <div class="empty-icon">📁</div>
          <div class="empty-text">暂无项目，请创建一个新项目</div>
        </div>
        <div v-else class="project-grid">
          <div
            v-for="project in projects"
            :key="project.projectId"
            class="project-card"
            @click="viewProjectDetail(project.projectId)"
          >
            <div class="card-header">
              <div class="project-label">项目</div>
              <div class="card-actions" @click.stop>
                <n-button
                  type="tertiary"
                  size="small"
                  class="action-btn"
                  @click="editProject(project)"
                >
                  ✏️
                </n-button>
                <n-button
                  type="tertiary"
                  size="small"
                  class="action-btn delete-btn"
                  @click="deleteProject(project.projectId)"
                >
                  🗑️
                </n-button>
              </div>
            </div>
            <div class="card-content">
              <div class="project-icon">📁</div>
              <div class="project-name">{{ project.projectName }}</div>
              <div class="project-id">#{{ project.projectId }}</div>
            </div>
            <div class="card-footer">
              <n-button type="primary" size="small" class="view-btn" @click.stop="viewProjectDetail(project.projectId)">
                查看详情
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建项目对话框 -->
    <n-modal v-model:show="showCreateModal" preset="dialog" title="创建新项目">
      <div class="create-form">
        <n-input
          v-model:value="projectName"
          placeholder="项目名称"
          @keyup.enter="createProject"
          autofocus
        />
        <div class="form-actions">
          <n-button type="primary" @click="createProject" :disabled="!projectName.trim()">
            创建
          </n-button>
          <n-button @click="showCreateModal = false">取消</n-button>
        </div>
      </div>
    </n-modal>

    <!-- 编辑项目对话框 -->
    <n-modal v-model:show="showEditModal" preset="dialog" title="编辑项目">
      <div class="create-form" v-if="editingProject">
        <n-input
          v-model:value="editingProject.projectName"
          placeholder="项目名称"
          @keyup.enter="saveEdit"
          autofocus
        />
        <div class="form-actions">
          <n-button type="primary" @click="saveEdit" :disabled="!editingProject.projectName.trim()">
            保存
          </n-button>
          <n-button @click="cancelEdit">取消</n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore, type Project } from '../../stores/project';
import { getCurrentDateString } from '../../utils/date';

const projectStore = useProjectStore();
const router = useRouter();

const projectName = ref(getCurrentDateString());
const editingProject = ref<Project | null>(null);
const showCreateModal = ref(false);
const showEditModal = ref(false);

// 使用 store 中的状态
const projects = computed(() => projectStore.allProjects);
const loading = computed(() => projectStore.loading);
const error = computed(() => projectStore.error);

// 加载项目列表
async function loadProjects() {
  await projectStore.loadProjects();
}

// 创建项目
async function createProject() {
  if (!projectName.value.trim()) {
    return;
  }
  
  try {
    await projectStore.createProject(projectName.value.trim());
    projectName.value = getCurrentDateString();
    showCreateModal.value = false;
  } catch (error) {
    console.error('创建项目失败:', error);
  }
}

// 编辑项目
function editProject(project: Project) {
  editingProject.value = { ...project };
  showEditModal.value = true;
}

// 保存编辑
async function saveEdit() {
  if (!editingProject.value || !editingProject.value.projectName.trim()) {
    return;
  }
  
  try {
    await projectStore.updateProject(
      editingProject.value.projectId,
      editingProject.value.projectName.trim()
    );
    editingProject.value = null;
    showEditModal.value = false;
  } catch (error) {
    console.error('更新项目失败:', error);
  }
}

// 取消编辑
function cancelEdit() {
  editingProject.value = null;
  showEditModal.value = false;
}

// 删除项目
async function deleteProject(projectId: number) {
  if (!confirm('确定要删除这个项目吗？')) {
    return;
  }
  
  try {
    await projectStore.deleteProject(projectId);
  } catch (error) {
    console.error('删除项目失败:', error);
  }
}

// 查看项目详情
function viewProjectDetail(projectId: number) {
  router.push(`/projects/${projectId}`);
}

// 初始化
onMounted(() => {
  loadProjects();
});
</script>

<style scoped>
.project-page {
  padding: 0;
  height: 100%;
  background: #1a1a1a;
  color: #fff;
}

.project-layout {
  display: flex;
  height: 100%;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
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

.error-message {
  padding: 16px;
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid #ff4d4f;
  border-radius: 8px;
  color: #ff4d4f;
  margin-bottom: 20px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #888;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.project-card {
  background: #1e1e1e;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border-color: #00bcd4;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #2d2d2d;
}

.project-label {
  background: #00bcd4;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  padding: 4px 8px;
  min-width: auto;
}

.delete-btn:hover {
  color: #ff4d4f;
}

.card-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.project-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.project-name {
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 8px;
  word-break: break-word;
}

.project-id {
  font-size: 14px;
  color: #888;
}

.card-footer {
  padding: 12px;
  border-top: 1px solid #2d2d2d;
}

.view-btn {
  width: 100%;
  background: #00bcd4;
  border-color: #00bcd4;
}

.view-btn:hover {
  background: #00acc1;
  border-color: #00acc1;
}

.create-form {
  padding: 20px 0;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
