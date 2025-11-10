<template>
  <div class="storyboard-sort">
    <div v-if="storyboards.length === 0" class="empty-state">暂无分镜</div>
    <div v-else class="sort-list">
      <div
        v-for="(storyboard, index) in sortedStoryboards"
        :key="storyboard.storyboardId"
        class="sort-item"
        :draggable="true"
        @dragstart="handleDragStart(index, $event)"
        @dragover.prevent="handleDragOver($event)"
        @drop="handleDrop(index, $event)"
        @dragend="handleDragEnd"
      >
        <div class="sort-handle">☰</div>
        <div class="sort-content">
          <div class="sort-number">#{{ storyboard.sequenceNumber }}</div>
          <div class="sort-description">
            {{ storyboard.description || '（无描述）' }}
          </div>
        </div>
        <div class="sort-actions">
          <button @click="moveUp(index)" :disabled="index === 0" class="move-btn">↑</button>
          <button @click="moveDown(index)" :disabled="index === sortedStoryboards.length - 1" class="move-btn">↓</button>
        </div>
      </div>
    </div>
    <div class="sort-actions-bar">
      <button @click="saveSort" class="save-btn" :disabled="!hasChanges">保存排序</button>
      <button @click="resetSort" class="reset-btn" :disabled="!hasChanges">重置</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storyboardDb } from '../../../utils/db';

interface Storyboard {
  storyboardId: number;
  projectId: number;
  sequenceNumber: number;
  description: string | null;
  imagePrompt: string | null;
  created_at: string;
  updated_at: string;
}

const props = defineProps<{
  projectId: number;
}>();

const emit = defineEmits<{
  sorted: [];
}>();

const storyboards = ref<Storyboard[]>([]);
const sortedStoryboards = ref<Storyboard[]>([]);
const originalOrder = ref<number[]>([]);
const draggedIndex = ref<number | null>(null);

const hasChanges = computed(() => {
  return JSON.stringify(sortedStoryboards.value.map(s => s.storyboardId)) !==
         JSON.stringify(originalOrder.value);
});

async function loadStoryboards() {
  try {
    storyboards.value = await storyboardDb.getByProjectId(props.projectId);
    sortedStoryboards.value = [...storyboards.value].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    originalOrder.value = sortedStoryboards.value.map(s => s.storyboardId);
  } catch (err) {
    alert('加载分镜失败: ' + (err as Error).message);
  }
}

function handleDragStart(index: number, event: DragEvent) {
  draggedIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
}

function handleDragOver(event: DragEvent) {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}

function handleDrop(targetIndex: number, event: DragEvent) {
  event.preventDefault();
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) {
    return;
  }

  const items = [...sortedStoryboards.value];
  const [draggedItem] = items.splice(draggedIndex.value, 1);
  items.splice(targetIndex, 0, draggedItem);

  // 更新序号
  items.forEach((item, index) => {
    item.sequenceNumber = index + 1;
  });

  sortedStoryboards.value = items;
  draggedIndex.value = null;
}

function handleDragEnd() {
  draggedIndex.value = null;
}

function moveUp(index: number) {
  if (index === 0) return;
  const items = [...sortedStoryboards.value];
  [items[index - 1], items[index]] = [items[index], items[index - 1]];
  items.forEach((item, idx) => {
    item.sequenceNumber = idx + 1;
  });
  sortedStoryboards.value = items;
}

function moveDown(index: number) {
  if (index === sortedStoryboards.value.length - 1) return;
  const items = [...sortedStoryboards.value];
  [items[index], items[index + 1]] = [items[index + 1], items[index]];
  items.forEach((item, idx) => {
    item.sequenceNumber = idx + 1;
  });
  sortedStoryboards.value = items;
}

async function saveSort() {
  try {
    const updates = sortedStoryboards.value.map((sb, index) => ({
      storyboardId: sb.storyboardId,
      sequenceNumber: index + 1,
    }));
    await storyboardDb.updateSequences(updates);
    originalOrder.value = sortedStoryboards.value.map(s => s.storyboardId);
    emit('sorted');
    alert('排序已保存');
  } catch (err) {
    alert('保存排序失败: ' + (err as Error).message);
  }
}

function resetSort() {
  loadStoryboards();
}

onMounted(() => {
  loadStoryboards();
});
</script>

<style scoped>
.storyboard-sort {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.sort-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.sort-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  cursor: move;
  transition: all 0.2s;
}

.sort-item:hover {
  background: #e9ecef;
}

.sort-item[draggable="true"]:active {
  opacity: 0.5;
}

.sort-handle {
  font-size: 18px;
  color: #999;
  cursor: grab;
}

.sort-handle:active {
  cursor: grabbing;
}

.sort-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-number {
  font-weight: bold;
  color: #007bff;
  min-width: 30px;
}

.sort-description {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.sort-actions {
  display: flex;
  gap: 5px;
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

.sort-actions-bar {
  display: flex;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.save-btn,
.reset-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn {
  background-color: #007bff;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-btn {
  background-color: #6c757d;
  color: white;
}

.reset-btn:hover:not(:disabled) {
  background-color: #5a6268;
}

.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

