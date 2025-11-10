<template>
  <div class="lip-sync-model-management">
    <div class="actions-bar">
      <button @click="showAddModal = true" class="add-btn">+ 添加对口型模型</button>
    </div>

    <div v-if="models.length === 0" class="empty-state">暂无对口型模型</div>
    <div v-else class="model-list">
      <div v-for="model in models" :key="model.modelId" class="model-item">
        <div class="model-info">
          <h4>{{ model.modelName }}</h4>
          <p v-if="model.modelPath">{{ model.modelPath }}</p>
          <div class="model-meta">
            <span v-if="model.isDefault === 1" class="default-badge">默认</span>
          </div>
        </div>
        <div class="model-actions">
          <button @click="setDefault(model.modelId)" :disabled="model.isDefault === 1" class="default-btn">设为默认</button>
          <button @click="editModel(model)" class="edit-btn">编辑</button>
          <button @click="deleteModel(model.modelId)" class="delete-btn">删除</button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑模型模态框 -->
    <div v-if="showAddModal || editingModel" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>{{ editingModel ? '编辑对口型模型' : '添加对口型模型' }}</h3>
        <div class="form-group">
          <label>模型名称：</label>
          <input v-model="modelForm.modelName" type="text" placeholder="请输入模型名称" required />
        </div>
        <div class="form-group">
          <label>模型路径：</label>
          <input v-model="modelForm.modelPath" type="text" placeholder="请输入模型路径" />
        </div>
        <div class="form-group">
          <label>API Key（可选）：</label>
          <input v-model="modelForm.apiKey" type="text" placeholder="请输入API Key" />
        </div>
        <div class="modal-actions">
          <button @click="saveModel" class="save-btn">保存</button>
          <button @click="closeModal" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { lipSyncModelDb } from '../../../utils/db';

interface LipSyncModel {
  modelId: number;
  projectId: number;
  modelName: string;
  modelPath: string | null;
  apiKey: string | null;
  isDefault: number;
  created_at: string;
  updated_at: string;
}

const props = defineProps<{
  projectId: number;
}>();

const models = ref<LipSyncModel[]>([]);
const showAddModal = ref(false);
const editingModel = ref<LipSyncModel | null>(null);
const modelForm = ref({
  modelName: '',
  modelPath: '',
  apiKey: '',
});

async function loadModels() {
  try {
    models.value = await lipSyncModelDb.getByProjectId(props.projectId);
  } catch (err) {
    alert('加载模型失败: ' + (err as Error).message);
  }
}

function editModel(model: LipSyncModel) {
  editingModel.value = model;
  modelForm.value = {
    modelName: model.modelName,
    modelPath: model.modelPath || '',
    apiKey: model.apiKey || '',
  };
}

function closeModal() {
  showAddModal.value = false;
  editingModel.value = null;
  modelForm.value = {
    modelName: '',
    modelPath: '',
    apiKey: '',
  };
}

async function saveModel() {
  if (!modelForm.value.modelName.trim()) {
    alert('请输入模型名称');
    return;
  }

  try {
    if (editingModel.value) {
      await lipSyncModelDb.update(
        editingModel.value.modelId,
        modelForm.value.modelName,
        modelForm.value.modelPath || undefined,
        modelForm.value.apiKey || undefined
      );
    } else {
      await lipSyncModelDb.create(
        props.projectId,
        modelForm.value.modelName,
        modelForm.value.modelPath || undefined,
        modelForm.value.apiKey || undefined
      );
    }
    closeModal();
    await loadModels();
  } catch (err) {
    alert('保存失败: ' + (err as Error).message);
  }
}

async function setDefault(modelId: number) {
  try {
    await lipSyncModelDb.setDefault(props.projectId, modelId);
    await loadModels();
  } catch (err) {
    alert('设置默认模型失败: ' + (err as Error).message);
  }
}

async function deleteModel(modelId: number) {
  if (!confirm('确定要删除这个模型吗？')) {
    return;
  }

  try {
    await lipSyncModelDb.delete(modelId);
    await loadModels();
  } catch (err) {
    alert('删除失败: ' + (err as Error).message);
  }
}

onMounted(() => {
  loadModels();
});
</script>

<style scoped>
.lip-sync-model-management {
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

.model-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.model-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
}

.model-info {
  flex: 1;
}

.model-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.model-info p {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 12px;
  word-break: break-all;
}

.model-meta {
  display: flex;
  gap: 8px;
}

.default-badge {
  padding: 2px 8px;
  background: #28a745;
  color: white;
  border-radius: 3px;
  font-size: 11px;
}

.model-actions {
  display: flex;
  gap: 8px;
}

.default-btn,
.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.default-btn {
  background-color: #ffc107;
  color: #333;
}

.default-btn:hover:not(:disabled) {
  background-color: #e0a800;
}

.default-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
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

