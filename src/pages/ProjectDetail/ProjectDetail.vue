<template>
  <div class="project-detail-page">
    <div class="page-layout">
      <!-- 左侧主内容区 -->
      <div class="main-content">
        <div class="header">
          <button @click="goBack" class="back-btn">← 返回</button>
          <h1>{{ project?.projectName || '项目详情' }}</h1>
        </div>

        <div v-if="loading" class="loading-state">加载中...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else>
          <!-- 添加分镜按钮 -->
          <div class="actions-bar">
            <button @click="openAddStoryboardModal" class="add-btn">
              + 添加分镜
            </button>
          </div>

          <!-- 分镜列表 -->
          <div v-if="storyboards.length === 0" class="empty-state">
            暂无分镜，请添加第一个分镜
          </div>
          <div v-else class="storyboard-list">
            <div
              v-for="storyboard in storyboards"
              :key="storyboard.storyboardId"
              class="storyboard-item"
            >
              <div class="storyboard-header">
                <div class="sequence-controls">
                  <button
                    @click="moveStoryboard(storyboard.storyboardId, 'up')"
                    :disabled="storyboard.sequenceNumber === 1"
                    class="move-btn"
                    title="上移"
                  >
                    ↑
                  </button>
                  <span class="sequence-number">#{{ storyboard.sequenceNumber }}</span>
                  <button
                    @click="moveStoryboard(storyboard.storyboardId, 'down')"
                    :disabled="storyboard.sequenceNumber === storyboards.length"
                    class="move-btn"
                    title="下移"
                  >
                    ↓
                  </button>
                </div>
                <div class="storyboard-actions">
                  <button @click="editStoryboard(storyboard)" class="edit-btn">编辑</button>
                  <button @click="deleteStoryboard(storyboard.storyboardId)" class="delete-btn">删除</button>
                </div>
              </div>

              <div class="storyboard-content">
                <!-- 分镜描述 -->
                <div class="field-group">
                  <label>分镜描述：</label>
                  <div class="field-value">{{ storyboard.description || '（未填写）' }}</div>
                </div>

                <!-- 图片提示词 -->
                <div class="field-group">
                  <label>图片提示词：</label>
                  <div class="field-value">{{ storyboard.imagePrompt || '（未填写）' }}</div>
                </div>

                <!-- 旁白对白列表 -->
                <div class="dialogues-section">
                  <div class="dialogues-header">
                    <label>旁白对白：</label>
                    <button
                      @click="showAddDialogueModal = true; selectedStoryboardId = storyboard.storyboardId"
                      class="add-dialogue-btn"
                    >
                      + 添加旁白对白
                    </button>
                  </div>
                  <div v-if="storyboard.dialogues && storyboard.dialogues.length > 0" class="dialogues-list">
                    <div
                      v-for="dialogue in storyboard.dialogues"
                      :key="dialogue.dialogueId"
                      class="dialogue-item"
                    >
                      <div class="dialogue-content">
                        <div class="dialogue-text">{{ dialogue.content }}</div>
                        <div class="dialogue-meta">
                          <span v-if="dialogue.character" class="character">角色：{{ dialogue.character }}</span>
                          <span v-if="dialogue.tone" class="tone">语气：{{ dialogue.tone }}</span>
                        </div>
                      </div>
                      <div class="dialogue-actions">
                        <button @click="editDialogue(dialogue)" class="edit-btn-small">编辑</button>
                        <button @click="deleteDialogue(dialogue.dialogueId)" class="delete-btn-small">删除</button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="empty-dialogues">暂无旁白对白</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧功能菜单 -->
      <div class="right-menu">
        <div class="menu-item" @click="openDrawer('scenes')" :class="{ active: drawerType === 'scenes' }">
          <span class="menu-icon">🎬</span>
          <span class="menu-label">场景管理</span>
        </div>
        <div class="menu-item" @click="openDrawer('characters')" :class="{ active: drawerType === 'characters' }">
          <span class="menu-icon">👤</span>
          <span class="menu-label">角色管理</span>
        </div>
        <div class="menu-item" @click="openDrawer('sort')" :class="{ active: drawerType === 'sort' }">
          <span class="menu-icon">📋</span>
          <span class="menu-label">分镜排序</span>
        </div>
        <div class="menu-item" @click="openDrawer('image-models')" :class="{ active: drawerType === 'image-models' }">
          <span class="menu-icon">🖼️</span>
          <span class="menu-label">图片模型</span>
        </div>
        <div class="menu-item" @click="openDrawer('video-models')" :class="{ active: drawerType === 'video-models' }">
          <span class="menu-icon">🎥</span>
          <span class="menu-label">视频模型</span>
        </div>
        <div class="menu-item" @click="openDrawer('lip-sync-models')" :class="{ active: drawerType === 'lip-sync-models' }">
          <span class="menu-icon">💬</span>
          <span class="menu-label">对口型模型</span>
        </div>
      </div>
    </div>

    <!-- 右侧 Drawer -->
    <div v-if="drawerVisible" class="drawer-overlay" @click="closeDrawer">
      <div class="drawer" @click.stop>
        <div class="drawer-header">
          <h2>{{ drawerTitle }}</h2>
          <button @click="closeDrawer" class="drawer-close">×</button>
        </div>
        <div class="drawer-content">
          <!-- 场景管理 -->
          <div v-if="drawerType === 'scenes'" class="drawer-panel">
            <SceneManagement :project-id="projectId" />
          </div>

          <!-- 角色管理 -->
          <div v-if="drawerType === 'characters'" class="drawer-panel">
            <CharacterManagement :project-id="projectId" />
          </div>

          <!-- 分镜排序 -->
          <div v-if="drawerType === 'sort'" class="drawer-panel">
            <StoryboardSort :project-id="projectId" @sorted="loadStoryboards" />
          </div>

          <!-- 图片模型管理 -->
          <div v-if="drawerType === 'image-models'" class="drawer-panel">
            <ImageModelManagement :project-id="projectId" />
          </div>

          <!-- 视频模型管理 -->
          <div v-if="drawerType === 'video-models'" class="drawer-panel">
            <VideoModelManagement :project-id="projectId" />
          </div>

          <!-- 对口型模型管理 -->
          <div v-if="drawerType === 'lip-sync-models'" class="drawer-panel">
            <LipSyncModelManagement :project-id="projectId" />
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑分镜模态框 -->
    <div v-if="showAddStoryboardModal || editingStoryboard" class="modal-overlay" @click="closeStoryboardModal">
      <div class="modal" @click.stop>
        <h3>{{ editingStoryboard ? '编辑分镜' : '添加分镜' }}</h3>
        <div class="form-group">
          <label>序号：</label>
          <input
            v-model.number="storyboardForm.sequenceNumber"
            type="number"
            min="1"
            placeholder="分镜序号"
          />
        </div>
        <div class="form-group">
          <label>分镜描述：</label>
          <textarea
            v-model="storyboardForm.description"
            rows="3"
            placeholder="请输入分镜描述"
          ></textarea>
        </div>
        <div class="form-group">
          <label>图片提示词：</label>
          <textarea
            v-model="storyboardForm.imagePrompt"
            rows="3"
            placeholder="请输入图片提示词"
          ></textarea>
        </div>
        <div class="modal-actions">
          <button @click="saveStoryboard" class="save-btn">保存</button>
          <button @click="closeStoryboardModal" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑旁白对白模态框 -->
    <div v-if="showAddDialogueModal || editingDialogue" class="modal-overlay" @click="closeDialogueModal">
      <div class="modal" @click.stop>
        <h3>{{ editingDialogue ? '编辑旁白对白' : '添加旁白对白' }}</h3>
        <div class="form-group">
          <label>内容：</label>
          <textarea
            v-model="dialogueForm.content"
            rows="3"
            placeholder="请输入旁白或对白内容"
            required
          ></textarea>
        </div>
        <div class="form-group">
          <label>角色：</label>
          <input
            v-model="dialogueForm.character"
            type="text"
            placeholder="请输入角色名称（可选）"
          />
        </div>
        <div class="form-group">
          <label>语气：</label>
          <input
            v-model="dialogueForm.tone"
            type="text"
            placeholder="请输入语气（可选）"
          />
        </div>
        <div class="modal-actions">
          <button @click="saveDialogue" class="save-btn">保存</button>
          <button @click="closeDialogueModal" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storyboardDb, dialogueDb, projectDb } from '../../utils/db';
import SceneManagement from './components/SceneManagement.vue';
import CharacterManagement from './components/CharacterManagement.vue';
import StoryboardSort from './components/StoryboardSort.vue';
import ImageModelManagement from './components/ImageModelManagement.vue';
import VideoModelManagement from './components/VideoModelManagement.vue';
import LipSyncModelManagement from './components/LipSyncModelManagement.vue';

interface Storyboard {
  storyboardId: number;
  projectId: number;
  sequenceNumber: number;
  description: string | null;
  imagePrompt: string | null;
  created_at: string;
  updated_at: string;
  dialogues?: Dialogue[];
}

interface Dialogue {
  dialogueId: number;
  storyboardId: number;
  content: string;
  character: string | null;
  tone: string | null;
  sequenceNumber: number;
  created_at: string;
  updated_at: string;
}

const route = useRoute();
const router = useRouter();

const projectId = computed(() => Number(route.params.id));
const project = ref<{ projectId: number; projectName: string } | null>(null);
const storyboards = ref<Storyboard[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const showAddStoryboardModal = ref(false);
const editingStoryboard = ref<Storyboard | null>(null);
const storyboardForm = ref({
  sequenceNumber: 0,
  description: '',
  imagePrompt: '',
});

const showAddDialogueModal = ref(false);
const selectedStoryboardId = ref<number | null>(null);
const editingDialogue = ref<Dialogue | null>(null);
const dialogueForm = ref({
  content: '',
  character: '',
  tone: '',
});

// Drawer 相关状态
const drawerVisible = ref(false);
const drawerType = ref<string>('');
const drawerTitles: Record<string, string> = {
  'scenes': '场景管理',
  'characters': '角色管理',
  'sort': '分镜排序',
  'image-models': '图片模型管理',
  'video-models': '视频模型管理',
  'lip-sync-models': '对口型模型管理',
};

const drawerTitle = computed(() => drawerTitles[drawerType.value] || '');

function openDrawer(type: string) {
  drawerType.value = type;
  drawerVisible.value = true;
}

function closeDrawer() {
  drawerVisible.value = false;
  // 延迟清除类型，以便动画完成
  setTimeout(() => {
    if (!drawerVisible.value) {
      drawerType.value = '';
    }
  }, 300);
}

// 加载项目信息
async function loadProject() {
  try {
    const proj = await projectDb.getById(projectId.value);
    if (!proj) {
      error.value = '项目不存在';
      return;
    }
    project.value = proj;
  } catch (err) {
    error.value = (err as Error).message;
  }
}

// 加载分镜列表
async function loadStoryboards() {
  loading.value = true;
  error.value = null;
  try {
    const boards = await storyboardDb.getByProjectId(projectId.value);
    // 为每个分镜加载旁白对白
    const boardsWithDialogues = await Promise.all(
      boards.map(async (board) => {
        const dialogues = await dialogueDb.getByStoryboardId(board.storyboardId);
        return { ...board, dialogues };
      })
    );
    storyboards.value = boardsWithDialogues;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
}

// 打开添加分镜模态框
function openAddStoryboardModal() {
  // 计算下一个序号（取当前最大序号+1）
  const maxSequence = storyboards.value.length > 0
    ? Math.max(...storyboards.value.map(s => s.sequenceNumber))
    : 0;
  storyboardForm.value = {
    sequenceNumber: maxSequence + 1,
    description: '',
    imagePrompt: '',
  };
  showAddStoryboardModal.value = true;
}

// 添加/编辑分镜
function editStoryboard(storyboard: Storyboard) {
  editingStoryboard.value = storyboard;
  storyboardForm.value = {
    sequenceNumber: storyboard.sequenceNumber,
    description: storyboard.description || '',
    imagePrompt: storyboard.imagePrompt || '',
  };
}

function closeStoryboardModal() {
  showAddStoryboardModal.value = false;
  editingStoryboard.value = null;
  // 计算下一个序号（取当前最大序号+1）
  const maxSequence = storyboards.value.length > 0
    ? Math.max(...storyboards.value.map(s => s.sequenceNumber))
    : 0;
  storyboardForm.value = {
    sequenceNumber: maxSequence + 1,
    description: '',
    imagePrompt: '',
  };
}

async function saveStoryboard() {
  if (!storyboardForm.value.sequenceNumber || storyboardForm.value.sequenceNumber < 1) {
    alert('请输入有效的序号');
    return;
  }

  try {
    if (editingStoryboard.value) {
      // 更新分镜
      await storyboardDb.update(
        editingStoryboard.value.storyboardId,
        storyboardForm.value.sequenceNumber,
        storyboardForm.value.description || undefined,
        storyboardForm.value.imagePrompt || undefined
      );
    } else {
      // 创建新分镜
      await storyboardDb.create(
        projectId.value,
        storyboardForm.value.sequenceNumber,
        storyboardForm.value.description || undefined,
        storyboardForm.value.imagePrompt || undefined
      );
    }
    closeStoryboardModal();
    await loadStoryboards();
  } catch (err) {
    alert('保存失败: ' + (err as Error).message);
  }
}

// 删除分镜
async function deleteStoryboard(storyboardId: number) {
  if (!confirm('确定要删除这个分镜吗？这将同时删除该分镜下的所有旁白对白。')) {
    return;
  }

  try {
    await storyboardDb.delete(storyboardId);
    await loadStoryboards();
  } catch (err) {
    alert('删除失败: ' + (err as Error).message);
  }
}

// 移动分镜顺序
async function moveStoryboard(storyboardId: number, direction: 'up' | 'down') {
  const currentIndex = storyboards.value.findIndex(s => s.storyboardId === storyboardId);
  if (currentIndex === -1) return;

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= storyboards.value.length) return;

  const current = storyboards.value[currentIndex];
  const target = storyboards.value[targetIndex];

  // 交换序号
  const tempSequence = current.sequenceNumber;
  current.sequenceNumber = target.sequenceNumber;
  target.sequenceNumber = tempSequence;

  try {
    await storyboardDb.updateSequences([
      { storyboardId: current.storyboardId, sequenceNumber: current.sequenceNumber },
      { storyboardId: target.storyboardId, sequenceNumber: target.sequenceNumber },
    ]);
    await loadStoryboards();
  } catch (err) {
    alert('移动失败: ' + (err as Error).message);
    await loadStoryboards();
  }
}

// 添加/编辑旁白对白
function editDialogue(dialogue: Dialogue) {
  editingDialogue.value = dialogue;
  selectedStoryboardId.value = dialogue.storyboardId;
  dialogueForm.value = {
    content: dialogue.content,
    character: dialogue.character || '',
    tone: dialogue.tone || '',
  };
}

function closeDialogueModal() {
  showAddDialogueModal.value = false;
  selectedStoryboardId.value = null;
  editingDialogue.value = null;
  dialogueForm.value = {
    content: '',
    character: '',
    tone: '',
  };
}

async function saveDialogue() {
  if (!dialogueForm.value.content.trim()) {
    alert('请输入旁白对白内容');
    return;
  }

  const targetStoryboardId = editingDialogue.value
    ? editingDialogue.value.storyboardId
    : selectedStoryboardId.value;

  if (!targetStoryboardId) {
    alert('请选择分镜');
    return;
  }

  try {
    if (editingDialogue.value) {
      // 更新旁白对白
      await dialogueDb.update(
        editingDialogue.value.dialogueId,
        dialogueForm.value.content,
        dialogueForm.value.character || undefined,
        dialogueForm.value.tone || undefined
      );
    } else {
      // 创建新旁白对白
      await dialogueDb.create(
        targetStoryboardId,
        dialogueForm.value.content,
        dialogueForm.value.character || undefined,
        dialogueForm.value.tone || undefined
      );
    }
    closeDialogueModal();
    await loadStoryboards();
  } catch (err) {
    alert('保存失败: ' + (err as Error).message);
  }
}

// 删除旁白对白
async function deleteDialogue(dialogueId: number) {
  if (!confirm('确定要删除这条旁白对白吗？')) {
    return;
  }

  try {
    await dialogueDb.delete(dialogueId);
    await loadStoryboards();
  } catch (err) {
    alert('删除失败: ' + (err as Error).message);
  }
}

// 返回
function goBack() {
  router.push('/projects');
}

// 初始化
onMounted(async () => {
  await loadProject();
  await loadStoryboards();
});
</script>

<style scoped>
.project-detail-page {
  padding: 0;
  height: 100%;
}

.page-layout {
  display: flex;
  height: 100%;
  gap: 0;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.back-btn {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.back-btn:hover {
  background-color: #5a6268;
}

h1 {
  margin: 0;
  color: #333;
}

.loading-state,
.empty-state {
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

.actions-bar {
  margin-bottom: 20px;
}

.add-btn {
  padding: 10px 20px;
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

.storyboard-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.storyboard-item {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  transition: box-shadow 0.2s;
}

.storyboard-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.storyboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.sequence-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.move-btn {
  padding: 4px 8px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.move-btn:hover:not(:disabled) {
  background-color: #e9ecef;
}

.move-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sequence-number {
  font-weight: bold;
  color: #007bff;
  min-width: 40px;
  text-align: center;
}

.storyboard-actions {
  display: flex;
  gap: 10px;
}

.storyboard-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-group label {
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.field-value {
  color: #333;
  line-height: 1.6;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  min-height: 20px;
}

.dialogues-section {
  margin-top: 10px;
}

.dialogues-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.add-dialogue-btn {
  padding: 6px 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.add-dialogue-btn:hover {
  background-color: #218838;
}

.dialogues-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dialogue-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
}

.dialogue-content {
  flex: 1;
}

.dialogue-text {
  color: #333;
  line-height: 1.6;
  margin-bottom: 8px;
}

.dialogue-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #666;
}

.character,
.tone {
  padding: 2px 8px;
  background-color: #e9ecef;
  border-radius: 3px;
}

.dialogue-actions {
  display: flex;
  gap: 5px;
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

.edit-btn-small,
.delete-btn-small {
  padding: 4px 8px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
}

.edit-btn-small {
  background-color: #28a745;
  color: white;
}

.edit-btn-small:hover {
  background-color: #218838;
}

.delete-btn-small {
  background-color: #dc3545;
  color: white;
}

.delete-btn-small:hover {
  background-color: #c82333;
}

.empty-dialogues {
  padding: 15px;
  text-align: center;
  color: #999;
  font-size: 14px;
  background-color: #f8f9fa;
  border-radius: 4px;
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
  min-width: 500px;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal h3 {
  margin-bottom: 20px;
  color: #333;
}

.modal .form-group {
  margin-bottom: 20px;
}

.modal .form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.modal .form-group input,
.modal .form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.modal .form-group input:focus,
.modal .form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
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

/* 右侧功能菜单 */
.right-menu {
  width: 80px;
  background: #f8f9fa;
  border-left: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 10px;
}

.menu-item {
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  padding: 8px;
  box-sizing: border-box;
}

.menu-item:hover {
  background: #e9ecef;
}

.menu-item.active {
  background: #007bff;
  color: white;
}

.menu-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.menu-label {
  font-size: 11px;
  text-align: center;
  line-height: 1.2;
  word-break: break-all;
}

/* Drawer 样式 */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 500px;
  max-width: 90vw;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s;
  z-index: 2001;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.drawer-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.drawer-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.drawer-close:hover {
  background: #f0f0f0;
  color: #333;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.drawer-panel {
  height: 100%;
}
</style>

