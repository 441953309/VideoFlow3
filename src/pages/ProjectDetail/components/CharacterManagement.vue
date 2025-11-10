<template>
  <div class="character-management">
    <div class="actions-bar">
      <button @click="showAddModal = true" class="add-btn">+ 添加角色</button>
    </div>

    <div v-if="characters.length === 0" class="empty-state">暂无角色</div>
    <div v-else class="character-list">
      <div v-for="character in characters" :key="character.characterId" class="character-item">
        <div class="character-info">
          <h4>{{ character.characterName }}</h4>
          <p v-if="character.description">{{ character.description }}</p>
          <div v-if="character.voice" class="character-meta">
            <span>声音：{{ character.voice }}</span>
          </div>
        </div>
        <div class="character-actions">
          <button @click="editCharacter(character)" class="edit-btn">编辑</button>
          <button @click="deleteCharacter(character.characterId)" class="delete-btn">删除</button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑角色模态框 -->
    <div v-if="showAddModal || editingCharacter" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>{{ editingCharacter ? '编辑角色' : '添加角色' }}</h3>
        <div class="form-group">
          <label>角色名称：</label>
          <input v-model="characterForm.characterName" type="text" placeholder="请输入角色名称" required />
        </div>
        <div class="form-group">
          <label>描述：</label>
          <textarea v-model="characterForm.description" rows="3" placeholder="请输入角色描述（可选）"></textarea>
        </div>
        <div class="form-group">
          <label>声音：</label>
          <input v-model="characterForm.voice" type="text" placeholder="请输入声音特征（可选）" />
        </div>
        <div class="modal-actions">
          <button @click="saveCharacter" class="save-btn">保存</button>
          <button @click="closeModal" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { characterDb } from '../../../utils/db';

interface Character {
  characterId: number;
  projectId: number;
  characterName: string;
  description: string | null;
  voice: string | null;
  created_at: string;
  updated_at: string;
}

const props = defineProps<{
  projectId: number;
}>();

const characters = ref<Character[]>([]);
const showAddModal = ref(false);
const editingCharacter = ref<Character | null>(null);
const characterForm = ref({
  characterName: '',
  description: '',
  voice: '',
});

async function loadCharacters() {
  try {
    characters.value = await characterDb.getByProjectId(props.projectId);
  } catch (err) {
    alert('加载角色失败: ' + (err as Error).message);
  }
}

function editCharacter(character: Character) {
  editingCharacter.value = character;
  characterForm.value = {
    characterName: character.characterName,
    description: character.description || '',
    voice: character.voice || '',
  };
}

function closeModal() {
  showAddModal.value = false;
  editingCharacter.value = null;
  characterForm.value = {
    characterName: '',
    description: '',
    voice: '',
  };
}

async function saveCharacter() {
  if (!characterForm.value.characterName.trim()) {
    alert('请输入角色名称');
    return;
  }

  try {
    if (editingCharacter.value) {
      await characterDb.update(
        editingCharacter.value.characterId,
        characterForm.value.characterName,
        characterForm.value.description || undefined,
        characterForm.value.voice || undefined
      );
    } else {
      await characterDb.create(
        props.projectId,
        characterForm.value.characterName,
        characterForm.value.description || undefined,
        characterForm.value.voice || undefined
      );
    }
    closeModal();
    await loadCharacters();
  } catch (err) {
    alert('保存失败: ' + (err as Error).message);
  }
}

async function deleteCharacter(characterId: number) {
  if (!confirm('确定要删除这个角色吗？')) {
    return;
  }

  try {
    await characterDb.delete(characterId);
    await loadCharacters();
  } catch (err) {
    alert('删除失败: ' + (err as Error).message);
  }
}

onMounted(() => {
  loadCharacters();
});
</script>

<style scoped>
.character-management {
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

.character-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.character-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
}

.character-info {
  flex: 1;
}

.character-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.character-info p {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
}

.character-meta {
  font-size: 12px;
  color: #999;
}

.character-actions {
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

