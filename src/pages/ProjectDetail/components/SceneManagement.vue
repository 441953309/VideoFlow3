<template>
  <div class="scene-management">
    <div class="actions-bar">
      <button @click="showAddModal = true" class="add-btn">+ 添加场景</button>
    </div>

    <div v-if="scenes.length === 0" class="empty-state">暂无场景</div>
    <div v-else class="scene-list">
      <div v-for="scene in scenes" :key="scene.sceneId" class="scene-item">
        <div class="scene-info">
          <h4>{{ scene.sceneName }}</h4>
          <p v-if="scene.description">{{ scene.description }}</p>
        </div>
        <div class="scene-actions">
          <button @click="editScene(scene)" class="edit-btn">编辑</button>
          <button @click="deleteScene(scene.sceneId)" class="delete-btn">删除</button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑场景模态框 -->
    <div v-if="showAddModal || editingScene" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>{{ editingScene ? '编辑场景' : '添加场景' }}</h3>
        <div class="form-group">
          <label>场景名称：</label>
          <input v-model="sceneForm.sceneName" type="text" placeholder="请输入场景名称" required />
        </div>
        <div class="form-group">
          <label>描述：</label>
          <textarea v-model="sceneForm.description" rows="3" placeholder="请输入场景描述（可选）"></textarea>
        </div>
        <div class="modal-actions">
          <button @click="saveScene" class="save-btn">保存</button>
          <button @click="closeModal" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { sceneDb } from '../../../utils/db';

interface Scene {
  sceneId: number;
  projectId: number;
  sceneName: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const props = defineProps<{
  projectId: number;
}>();

const scenes = ref<Scene[]>([]);
const showAddModal = ref(false);
const editingScene = ref<Scene | null>(null);
const sceneForm = ref({
  sceneName: '',
  description: '',
});

async function loadScenes() {
  try {
    scenes.value = await sceneDb.getByProjectId(props.projectId);
  } catch (err) {
    alert('加载场景失败: ' + (err as Error).message);
  }
}

function editScene(scene: Scene) {
  editingScene.value = scene;
  sceneForm.value = {
    sceneName: scene.sceneName,
    description: scene.description || '',
  };
}

function closeModal() {
  showAddModal.value = false;
  editingScene.value = null;
  sceneForm.value = {
    sceneName: '',
    description: '',
  };
}

async function saveScene() {
  if (!sceneForm.value.sceneName.trim()) {
    alert('请输入场景名称');
    return;
  }

  try {
    if (editingScene.value) {
      await sceneDb.update(
        editingScene.value.sceneId,
        sceneForm.value.sceneName,
        sceneForm.value.description || undefined
      );
    } else {
      await sceneDb.create(
        props.projectId,
        sceneForm.value.sceneName,
        sceneForm.value.description || undefined
      );
    }
    closeModal();
    await loadScenes();
  } catch (err) {
    alert('保存失败: ' + (err as Error).message);
  }
}

async function deleteScene(sceneId: number) {
  if (!confirm('确定要删除这个场景吗？')) {
    return;
  }

  try {
    await sceneDb.delete(sceneId);
    await loadScenes();
  } catch (err) {
    alert('删除失败: ' + (err as Error).message);
  }
}

onMounted(() => {
  loadScenes();
});
</script>

<style scoped>
.scene-management {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.actions-bar {
  margin-bottom: 20px;
}

.add-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-btn:hover {
  background-color: #0056b3;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.scene-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scene-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
}

.scene-info {
  flex: 1;
}

.scene-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.scene-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.scene-actions {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
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
  z-index: 3000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 8px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal h3 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.save-btn,
.cancel-btn {
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

