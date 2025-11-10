<template>
  <div class="project-detail-page">
    <!-- 顶部导航栏 -->
    <div class="top-header">
      <div class="header-left">
        <n-button type="tertiary" @click="goBack" class="back-btn">
          <template #icon>
            <span>←</span>
          </template>
          返回
        </n-button>
      </div>
      <div class="header-center">
        <n-input
          v-model:value="searchText"
          placeholder="在使用文档中搜索..."
          class="search-input"
          clearable
        >
          <template #prefix>
            <span>🔍</span>
          </template>
        </n-input>
        <div class="date-filters">
          <n-button
            v-for="date in dateFilters"
            :key="date"
            size="small"
            type="tertiary"
            :class="['date-filter-btn', { active: selectedDate === date }]"
            @click="selectedDate = date"
          >
            {{ date }}
          </n-button>
        </div>
      </div>
      <div class="header-right">
        <n-button type="tertiary" class="vip-btn">
          <template #icon>
            <span>👑</span>
          </template>
          VIP会员
        </n-button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-layout">
      <!-- 左侧控制面板 -->
      <div class="left-panel">
        <!-- 工具栏 -->
        <div class="toolbar">
          <n-button type="tertiary" size="small" class="tool-btn">
            <template #icon>
              <span>🔍</span>
            </template>
            筛选分镜
          </n-button>
          <div class="tool-item">
            <n-button type="tertiary" size="small" class="tool-btn">
              <template #icon>
                <span>📋</span>
              </template>
              任务队列
            </n-button>
            <n-switch v-model:value="taskQueueEnabled" size="small" />
          </div>
          <n-button type="tertiary" size="small" class="tool-btn">
            <template #icon>
              <span>🔍</span>
            </template>
            放大模式
          </n-button>
        </div>

        <!-- 分镜列表 -->
        <div class="storyboard-panel">
          <div
            v-for="storyboard in storyboards"
            :key="storyboard.storyboardId"
            :class="['storyboard-card', { active: selectedStoryboardId === storyboard.storyboardId }]"
            @click="selectStoryboard(storyboard.storyboardId)"
          >
            <!-- 分镜头部 -->
            <div class="card-header">
              <div class="card-number">#{{ storyboard.sequenceNumber }}</div>
              <div class="card-actions" @click.stop>
                <n-button
                  type="tertiary"
                  size="tiny"
                  class="action-btn"
                  @click="editStoryboard(storyboard)"
                >
                  ✏️
                </n-button>
                <n-button
                  type="tertiary"
                  size="tiny"
                  class="action-btn"
                  @click="deleteStoryboard(storyboard.storyboardId)"
                >
                  🗑️
                </n-button>
              </div>
            </div>

            <!-- 分镜内容 -->
            <div class="card-content">
              <n-button type="primary" size="small" class="generate-btn">
                <template #icon>
                  <span>✏️</span>
                </template>
                生成图片
              </n-button>

              <div class="media-controls">
                <n-button type="tertiary" size="small" class="media-btn">K</n-button>
                <n-button type="tertiary" size="small" class="media-btn">▶️</n-button>
                <n-button type="tertiary" size="small" class="media-btn">I</n-button>
              </div>

              <n-input
                v-model:value="storyboardTexts[storyboard.storyboardId]"
                type="textarea"
                :rows="2"
                placeholder="输入文本..."
                class="storyboard-text"
                @click.stop
              />

              <div class="batch-controls">
                <label>批量数量</label>
                <n-input-number
                  v-model:value="batchNumbers[storyboard.storyboardId]"
                  :min="1"
                  :max="100"
                  size="small"
                  class="batch-input"
                  @click.stop
                />
              </div>

              <div class="toggle-control">
                <n-switch v-model:value="lipSyncEnabled[storyboard.storyboardId]" size="small" />
                <label>视频口型</label>
              </div>

              <div class="character-tag">
                <span>男-深空紫发-海贼大衣</span>
              </div>
            </div>

            <!-- 底部操作栏 -->
            <div class="card-footer" @click.stop>
              <n-button type="tertiary" size="small" class="footer-btn" @click="editStoryboard(storyboard)">
                <template #icon>
                  <span>✏️</span>
                </template>
                编辑
              </n-button>
              <n-button type="tertiary" size="small" class="footer-btn">
                <template #icon>
                  <span>🧠</span>
                </template>
                推理
              </n-button>
              <n-button type="tertiary" size="small" class="footer-btn">
                <template #icon>
                  <span>🏷️</span>
                </template>
                标签
              </n-button>
              <n-button type="tertiary" size="small" class="footer-btn">
                <template #icon>
                  <span>📄</span>
                </template>
                详情
              </n-button>
              <n-button type="tertiary" size="small" class="footer-btn">
                <template #icon>
                  <span>⚙️</span>
                </template>
                工作流
              </n-button>
            </div>
          </div>

          <!-- 添加分镜按钮 -->
          <div class="add-storyboard-buttons">
            <n-button type="primary" size="small" @click="openAddStoryboardModal">
              + 新建分镜
            </n-button>
            <n-button type="error" size="small" @click="deleteSelectedStoryboard">
              X 删除分镜
            </n-button>
          </div>
        </div>
      </div>

      <!-- 中央主内容区 -->
      <div class="center-panel">
        <div v-if="!selectedStoryboard" class="empty-center">
          <div class="empty-icon">📹</div>
          <div class="empty-text">请选择一个分镜查看详情</div>
        </div>
        <div v-else class="storyboard-detail">
          <!-- 操作按钮 -->
          <div class="detail-actions">
            <n-button type="tertiary" size="small" class="action-btn">
              <template #icon>
                <span>✏️</span>
              </template>
              改写
            </n-button>
            <n-button type="tertiary" size="small" class="action-btn">
              <template #icon>
                <span>👤</span>
              </template>
              角色匹配
            </n-button>
          </div>

          <!-- 文本区域 -->
          <div class="text-area-container">
            <n-input
              v-model:value="selectedDialogueText"
              type="textarea"
              :rows="8"
              placeholder="输入对话内容..."
              class="dialogue-textarea"
            />
          </div>

          <!-- 底部控制 -->
          <div class="detail-controls">
            <div class="control-left">
              <n-select
                v-model:value="selectedVoice"
                :options="voiceOptions"
                placeholder="默认"
                size="small"
                class="voice-select"
              />
              <n-button type="tertiary" size="small" class="listen-btn">
                <template #icon>
                  <span>🔊</span>
                </template>
                试听
              </n-button>
            </div>
            <div class="control-right">
              <n-button type="tertiary" size="small" class="adjust-btn">
                <template #icon>
                  <span>↑</span>
                </template>
              </n-button>
              <n-button type="tertiary" size="small" class="adjust-btn">
                <template #icon>
                  <span>↓</span>
                </template>
              </n-button>
            </div>
          </div>

          <!-- 底部操作按钮 -->
          <div class="detail-footer">
            <n-button type="primary" size="small" @click="openAddStoryboardModal">
              + 新建分镜
            </n-button>
            <n-button type="error" size="small" @click="deleteSelectedStoryboard">
              X 删除分镜
            </n-button>
          </div>
        </div>
      </div>

      <!-- 右侧功能栏 -->
      <div class="right-panel">
        <div class="function-icons">
          <div class="icon-item" title="批量替换">
            <span>🔄</span>
          </div>
          <div class="icon-item" title="关闭作品" @click="goBack">
            <span>❌</span>
          </div>
          <div class="icon-item" title="网格">
            <span>⊞</span>
          </div>
          <div class="icon-item" title="图片">
            <span>🖼️</span>
          </div>
          <div class="icon-item" title="视频">
            <span>🎥</span>
          </div>
          <div class="icon-item" title="角色" @click="openDrawer('characters')">
            <span>👤</span>
          </div>
          <div class="icon-item" title="人物">
            <span>👥</span>
          </div>
          <div class="icon-item" title="场景" @click="openDrawer('scenes')">
            <span>🏢</span>
          </div>
          <div class="icon-item" title="麦克风">
            <span>🎤</span>
          </div>
          <div class="icon-item" title="向下">
            <span>⬇️</span>
          </div>
          <div class="icon-item" title="列表">
            <span>📋</span>
          </div>
          <div class="icon-item" title="设置">
            <span>⚙️</span>
          </div>
          <div class="icon-item" title="链接">
            <span>🔗</span>
          </div>
          <div class="icon-item" title="聊天">
            <span>💬</span>
          </div>
        </div>
        <div class="function-buttons">
          <n-button type="primary" size="small" @click="openAddStoryboardModal">
            + 新建分镜
          </n-button>
          <n-button type="error" size="small" @click="deleteSelectedStoryboard">
            X 删除分镜
          </n-button>
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
          <div v-if="drawerType === 'scenes'" class="drawer-panel">
            <SceneManagement :project-id="projectId" />
          </div>
          <div v-if="drawerType === 'characters'" class="drawer-panel">
            <CharacterManagement :project-id="projectId" />
          </div>
          <div v-if="drawerType === 'sort'" class="drawer-panel">
            <StoryboardSort :project-id="projectId" @sorted="loadStoryboards" />
          </div>
          <div v-if="drawerType === 'image-models'" class="drawer-panel">
            <ImageModelManagement :project-id="projectId" />
          </div>
          <div v-if="drawerType === 'video-models'" class="drawer-panel">
            <VideoModelManagement :project-id="projectId" />
          </div>
          <div v-if="drawerType === 'lip-sync-models'" class="drawer-panel">
            <LipSyncModelManagement :project-id="projectId" />
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑分镜模态框 -->
    <n-modal v-model:show="showStoryboardModal" preset="dialog" title="分镜">
      <div class="create-form" v-if="showStoryboardModal">
        <n-form-item label="序号">
          <n-input-number
            v-model:value="storyboardForm.sequenceNumber"
            :min="1"
            placeholder="分镜序号"
          />
        </n-form-item>
        <n-form-item label="分镜描述">
          <n-input
            v-model:value="storyboardForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分镜描述"
          />
        </n-form-item>
        <n-form-item label="图片提示词">
          <n-input
            v-model:value="storyboardForm.imagePrompt"
            type="textarea"
            :rows="3"
            placeholder="请输入图片提示词"
          />
        </n-form-item>
        <div class="form-actions">
          <n-button type="primary" @click="saveStoryboard" :disabled="!storyboardForm.sequenceNumber">
            {{ editingStoryboard ? '更新' : '创建' }}
          </n-button>
          <n-button @click="closeStoryboardModal">取消</n-button>
        </div>
      </div>
    </n-modal>
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

// 顶部导航栏
const searchText = ref('');
const dateFilters = ref(['11月5日', '11月10日']);
const selectedDate = ref('11月10日');

// 左侧面板
const taskQueueEnabled = ref(false);
const selectedStoryboardId = ref<number | null>(null);
const storyboardTexts = ref<Record<number, string>>({});
const batchNumbers = ref<Record<number, number>>({});
const lipSyncEnabled = ref<Record<number, boolean>>({});

// 中央面板
const selectedDialogueText = ref('');
const selectedVoice = ref<string | null>(null);
const voiceOptions = [
  { label: '默认', value: 'default' },
  { label: '男声', value: 'male' },
  { label: '女声', value: 'female' },
];

// 分镜表单
const showAddStoryboardModal = ref(false);
const editingStoryboard = ref<Storyboard | null>(null);
const storyboardForm = ref({
  sequenceNumber: 0,
  description: '',
  imagePrompt: '',
});

// Drawer
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

const selectedStoryboard = computed(() => {
  if (!selectedStoryboardId.value) return null;
  return storyboards.value.find(s => s.storyboardId === selectedStoryboardId.value) || null;
});

// 模态框显示状态
const showStoryboardModal = computed({
  get: () => showAddStoryboardModal.value || editingStoryboard.value !== null,
  set: (value) => {
    if (!value) {
      showAddStoryboardModal.value = false;
      editingStoryboard.value = null;
    }
  }
});

// 选择分镜
function selectStoryboard(storyboardId: number) {
  selectedStoryboardId.value = storyboardId;
  const storyboard = storyboards.value.find(s => s.storyboardId === storyboardId);
  if (storyboard && storyboard.dialogues && storyboard.dialogues.length > 0) {
    selectedDialogueText.value = storyboard.dialogues.map(d => d.content).join('\n');
  } else {
    selectedDialogueText.value = storyboardTexts.value[storyboardId] || '';
  }
}

// 打开 Drawer
function openDrawer(type: string) {
  drawerType.value = type;
  drawerVisible.value = true;
}

function closeDrawer() {
  drawerVisible.value = false;
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
    const boardsWithDialogues = await Promise.all(
      boards.map(async (board) => {
        const dialogues = await dialogueDb.getByStoryboardId(board.storyboardId);
        // 初始化默认值
        if (!storyboardTexts.value[board.storyboardId]) {
          storyboardTexts.value[board.storyboardId] = '';
        }
        if (!batchNumbers.value[board.storyboardId]) {
          batchNumbers.value[board.storyboardId] = 1;
        }
        if (lipSyncEnabled.value[board.storyboardId] === undefined) {
          lipSyncEnabled.value[board.storyboardId] = false;
        }
        return { ...board, dialogues };
      })
    );
    storyboards.value = boardsWithDialogues;
    // 自动选择第一个分镜
    if (boardsWithDialogues.length > 0 && !selectedStoryboardId.value) {
      selectStoryboard(boardsWithDialogues[0].storyboardId);
    }
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
}

// 打开添加分镜模态框
function openAddStoryboardModal() {
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

// 编辑分镜
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
}

async function saveStoryboard() {
  if (!storyboardForm.value.sequenceNumber || storyboardForm.value.sequenceNumber < 1) {
    return;
  }

  try {
    if (editingStoryboard.value) {
      await storyboardDb.update(
        editingStoryboard.value.storyboardId,
        storyboardForm.value.sequenceNumber,
        storyboardForm.value.description || undefined,
        storyboardForm.value.imagePrompt || undefined
      );
    } else {
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
    console.error('保存失败:', err);
  }
}

// 删除分镜
async function deleteStoryboard(storyboardId: number) {
  if (!confirm('确定要删除这个分镜吗？')) {
    return;
  }

  try {
    await storyboardDb.delete(storyboardId);
    if (selectedStoryboardId.value === storyboardId) {
      selectedStoryboardId.value = null;
    }
    await loadStoryboards();
  } catch (err) {
    console.error('删除失败:', err);
  }
}

// 删除选中的分镜
async function deleteSelectedStoryboard() {
  if (!selectedStoryboardId.value) {
    return;
  }
  await deleteStoryboard(selectedStoryboardId.value);
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  color: #fff;
  overflow: hidden;
}

/* 顶部导航栏 */
.top-header {
  height: 64px;
  background: #1e1e1e;
  border-bottom: 1px solid #2d2d2d;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 24px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
}

.back-btn {
  color: #fff;
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

.date-filter-btn.active {
  color: #00bcd4;
  border-bottom: 2px solid #00bcd4;
}

.header-right {
  display: flex;
  align-items: center;
}

.vip-btn {
  color: #ffd700;
}

/* 主布局 */
.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧控制面板 */
.left-panel {
  width: 400px;
  background: #1e1e1e;
  border-right: 1px solid #2d2d2d;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toolbar {
  padding: 16px;
  border-bottom: 1px solid #2d2d2d;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tool-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-btn {
  color: #ccc;
}

.storyboard-panel {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.storyboard-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.storyboard-card:hover {
  border-color: #00bcd4;
}

.storyboard-card.active {
  border-color: #00bcd4;
  background: #1f2a2e;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-number {
  font-weight: 600;
  color: #00bcd4;
  font-size: 16px;
}

.card-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  padding: 4px 8px;
  min-width: auto;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.generate-btn {
  width: 100%;
  background: #00bcd4;
  border-color: #00bcd4;
}

.media-controls {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.media-btn {
  min-width: 40px;
}

.storyboard-text {
  width: 100%;
}

.batch-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.batch-controls label {
  font-size: 12px;
  color: #ccc;
}

.batch-input {
  width: 80px;
}

.toggle-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-control label {
  font-size: 12px;
  color: #ccc;
}

.character-tag {
  padding: 6px 12px;
  background: #764ba2;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  text-align: center;
}

.card-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #2d2d2d;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.footer-btn {
  flex: 1;
  min-width: 60px;
  font-size: 12px;
}

.add-storyboard-buttons {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #2d2d2d;
}

/* 中央主内容区 */
.center-panel {
  flex: 1;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.empty-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
}

.storyboard-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
}

.detail-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.text-area-container {
  flex: 1;
  margin-bottom: 16px;
}

.dialogue-textarea {
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.detail-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.control-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.voice-select {
  width: 120px;
}

.listen-btn {
  color: #00bcd4;
}

.control-right {
  display: flex;
  gap: 8px;
}

.adjust-btn {
  min-width: 32px;
}

.detail-footer {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #2d2d2d;
}

/* 右侧功能栏 */
.right-panel {
  width: 60px;
  background: #1e1e1e;
  border-left: 1px solid #2d2d2d;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  gap: 16px;
  overflow-y: auto;
}

.function-icons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.icon-item {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 20px;
}

.icon-item:hover {
  background: #2d2d2d;
  transform: scale(1.1);
}

.function-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.function-buttons .n-button {
  width: 100%;
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
  from { opacity: 0; }
  to { opacity: 1; }
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 500px;
  max-width: 90vw;
  background: #1e1e1e;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s;
  z-index: 2001;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #2d2d2d;
}

.drawer-header h2 {
  margin: 0;
  font-size: 18px;
  color: #fff;
}

.drawer-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.drawer-close:hover {
  background: #2d2d2d;
  color: #fff;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.drawer-panel {
  height: 100%;
}

/* 表单样式 */
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
