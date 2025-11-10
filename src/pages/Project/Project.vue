<template>
  <div class="project-page">
    <h1>项目管理</h1>
    
    <!-- 创建项目表单 -->
    <section class="create-section">
      <h2>创建新项目</h2>
      <div class="form-group">
        <input
          v-model="projectName"
          type="text"
          placeholder="项目名称"
          @keyup.enter="createProject"
        />
        <button @click="createProject" :disabled="!projectName.trim()">
          创建项目
        </button>
      </div>
    </section>
    
    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <!-- 项目列表 -->
    <section class="project-list-section">
      <h2>项目列表</h2>
      <div v-if="loading" class="loading-state">
        加载中...
      </div>
      <div v-else-if="projects.length === 0" class="empty-state">
        暂无项目，请创建一个新项目
      </div>
      <div v-else class="project-list">
        <div
          v-for="project in projects"
          :key="project.projectId"
          class="project-item"
        >
          <div class="project-info">
            <span class="project-id">#{{ project.projectId }}</span>
            <span class="project-name" @click="viewProjectDetail(project.projectId)">{{ project.projectName }}</span>
          </div>
          <div class="project-actions">
            <button @click="viewProjectDetail(project.projectId)" class="view-btn">查看详情</button>
            <button @click="editProject(project)" class="edit-btn">编辑</button>
            <button @click="deleteProject(project.projectId)" class="delete-btn">删除</button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 编辑对话框 -->
    <div v-if="editingProject" class="modal-overlay" @click="cancelEdit">
      <div class="modal" @click.stop>
        <h3>编辑项目</h3>
        <div class="form-group">
          <input
            v-model="editingProject.projectName"
            type="text"
            placeholder="项目名称"
            @keyup.enter="saveEdit"
          />
        </div>
        <div class="modal-actions">
          <button @click="saveEdit" class="save-btn">保存</button>
          <button @click="cancelEdit" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>
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
    alert('请输入项目名称');
    return;
  }
  
  try {
    await projectStore.createProject(projectName.value.trim());
    projectName.value = getCurrentDateString(); // 重置为当前日期
  } catch (error) {
    alert('创建项目失败: ' + (error as Error).message);
  }
}

// 编辑项目
function editProject(project: Project) {
  editingProject.value = { ...project };
}

// 保存编辑
async function saveEdit() {
  if (!editingProject.value || !editingProject.value.projectName.trim()) {
    alert('请输入项目名称');
    return;
  }
  
  try {
    await projectStore.updateProject(
      editingProject.value.projectId,
      editingProject.value.projectName.trim()
    );
    editingProject.value = null;
  } catch (error) {
    alert('更新项目失败: ' + (error as Error).message);
  }
}

// 取消编辑
function cancelEdit() {
  editingProject.value = null;
}

// 删除项目
async function deleteProject(projectId: number) {
  if (!confirm('确定要删除这个项目吗？')) {
    return;
  }
  
  try {
    await projectStore.deleteProject(projectId);
  } catch (error) {
    alert('删除项目失败: ' + (error as Error).message);
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
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

h2 {
  margin-bottom: 20px;
  color: #555;
  font-size: 1.2em;
}

.create-section {
  margin-bottom: 40px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.form-group {
  display: flex;
  gap: 10px;
}

.form-group input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.form-group button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.form-group button:hover:not(:disabled) {
  background-color: #0056b3;
}

.form-group button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.project-list-section {
  margin-top: 30px;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.error-message {
  padding: 15px;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
  margin-bottom: 20px;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: box-shadow 0.2s;
}

.project-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.project-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.project-id {
  color: #999;
  font-size: 12px;
}

.project-name {
  font-weight: 500;
  color: #333;
  cursor: pointer;
  text-decoration: underline;
}

.project-name:hover {
  color: #007bff;
}

.project-actions {
  display: flex;
  gap: 10px;
}

.project-actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.view-btn {
  background-color: #007bff;
  color: white;
}

.view-btn:hover {
  background-color: #0056b3;
}

.edit-btn {
  background-color: #28a745;
  color: white;
}

.edit-btn:hover {
  background-color: #218838;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 8px;
  min-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal h3 {
  margin-bottom: 20px;
  color: #333;
}

.modal .form-group {
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.modal-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn {
  background-color: #007bff;
  color: white;
}

.save-btn:hover {
  background-color: #0056b3;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}
</style>

