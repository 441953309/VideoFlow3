<template>
  <div class="settings-page">
    <!-- 标签页导航 -->
    <n-tabs v-model:value="activeTab" type="line" class="settings-tabs">
      <n-tab-pane name="basic" tab="基础设置">
        <div class="settings-content">
          <!-- 大语言模型设置 -->
          <div class="settings-section">
            <div class="section-header">
              <h3 class="section-title">大语言模型设置</h3>
              <div class="header-actions">
                <n-button type="primary" class="test-btn">测试</n-button>
              </div>
            </div>
            <div class="section-body">
              <div class="form-group">
                <label class="form-label">大语言模型平台</label>
                <n-radio-group v-model:value="llm.platform" class="radio-group">
                  <n-radio value="aliyun">阿里云</n-radio>
                  <n-radio value="deepseek">DeepSeek官方</n-radio>
                  <n-radio value="google">Google</n-radio>
                </n-radio-group>
              </div>
              <div class="form-group">
                <label class="form-label">{{ getApiKeyLabel() }}</label>
                <div class="input-with-icon">
                  <n-input
                    v-model:value="llm.apiKey"
                    type="password"
                    :placeholder="getApiKeyPlaceholder()"
                    class="form-input"
                    show-password-on="click"
                  />
                </div>
              </div>
              <div class="form-group" v-if="getAvailableModels().length > 0">
                <label class="form-label">模型选择</label>
                <n-radio-group v-model:value="llm.model" class="radio-group">
                  <n-radio
                    v-for="model in getAvailableModels()"
                    :key="model.value"
                    :value="model.value"
                  >
                    {{ model.label }}
                  </n-radio>
                </n-radio-group>
              </div>
            </div>
          </div>

          <!-- 图片生成引擎设置 -->
          <div class="settings-section">
            <div class="section-header">
              <h3 class="section-title">图片生成引擎设置</h3>
              <div class="header-actions">
                <n-button type="primary" class="test-btn">测试</n-button>
              </div>
            </div>
            <div class="section-body">
              <div class="form-group">
                <label class="form-label">ComfyUI 服务器地址</label>
                <n-input
                  v-model:value="imageEngine.serverAddress"
                  placeholder="请输入 ComfyUI 服务器地址"
                  class="form-input"
                />
              </div>
            </div>
          </div>
        </div>
      </n-tab-pane>
      
      <n-tab-pane name="proxy" tab="代理设置">
        <div class="settings-content">
          <!-- 代理设置 -->
          <div class="settings-section">
            <div class="section-header">
              <h3 class="section-title">代理设置</h3>
            </div>
            <div class="section-body">
              <div class="form-group">
                <label class="form-label">启用代理</label>
                <n-switch v-model:value="proxy.enabled" />
              </div>
              <div class="form-group" v-if="proxy.enabled">
                <label class="form-label">代理类型</label>
                <n-radio-group v-model:value="proxy.type" class="radio-group">
                  <n-radio value="http">HTTP</n-radio>
                  <n-radio value="https">HTTPS</n-radio>
                  <n-radio value="socks5">SOCKS5</n-radio>
                </n-radio-group>
              </div>
              <div class="form-group" v-if="proxy.enabled">
                <label class="form-label">代理地址</label>
                <n-input
                  v-model:value="proxy.host"
                  placeholder="请输入代理服务器地址"
                  class="form-input"
                />
              </div>
              <div class="form-group" v-if="proxy.enabled">
                <label class="form-label">代理端口</label>
                <n-input
                  v-model:value="proxy.port"
                  placeholder="请输入代理端口"
                  class="form-input"
                  type="number"
                />
              </div>
              <div class="form-group" v-if="proxy.enabled">
                <label class="form-label">用户名（可选）</label>
                <n-input
                  v-model:value="proxy.username"
                  placeholder="请输入代理用户名"
                  class="form-input"
                />
              </div>
              <div class="form-group" v-if="proxy.enabled">
                <label class="form-label">密码（可选）</label>
                <div class="input-with-icon">
                  <n-input
                    v-model:value="proxy.password"
                    type="password"
                    placeholder="请输入代理密码"
                    class="form-input"
                    show-password-on="click"
                  />
                </div>
              </div>
              <div class="form-group" v-if="proxy.enabled">
                <n-button type="primary" class="test-btn">测试</n-button>
              </div>
            </div>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const activeTab = ref('basic');

// 图片生成引擎设置
const imageEngine = ref({
  serverAddress: 'http://127.0.0.1:8188/',
});

// 大语言模型设置
const llm = ref({
  platform: 'aliyun',
  apiKey: '',
  model: 'qwen-plus',
});

// 代理设置
const proxy = ref({
  enabled: false,
  type: 'http',
  host: '',
  port: '',
  username: '',
  password: '',
});

// 模型配置
const modelConfig = {
  aliyun: [
    { value: 'qwen-plus', label: 'qwen-plus' },
    { value: 'deepseek-v3.1', label: 'deepseek-v3.1' },
    { value: 'deepseek-v3', label: 'deepseek-v3' },
    { value: 'deepseek-r1', label: 'deepseek-r1' },
    { value: 'Moonshot-Kimi-K2-Instruct', label: 'Moonshot-Kimi-K2-Instruct' },
    { value: 'qwen-max', label: 'qwen-max' },
    { value: 'qwen-turbo', label: 'qwen-turbo' },
    { value: 'qwen-long', label: 'qwen-long' },
  ],
  deepseek: [
    { value: 'deepseek-chat', label: 'deepseek-chat' },
    { value: 'deepseek-reasoner', label: 'deepseek-reasoner' },
  ],
  google: [
    { value: 'gemini-2.5-pro', label: 'gemini-2.5-pro' },
    { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
    { value: 'gemini-2.0-flash', label: 'gemini-2.0-flash' },
  ],
};

// 获取可用模型列表
function getAvailableModels() {
  return modelConfig[llm.value.platform] || [];
}

// 监听平台变化，重置模型为默认值
watch(() => llm.value.platform, (newPlatform) => {
  const models = modelConfig[newPlatform] || [];
  if (models.length > 0) {
    llm.value.model = models[0].value;
  }
});

// 获取API-KEY标签
function getApiKeyLabel() {
  const labels = {
    aliyun: '阿里云 API-KEY',
    deepseek: 'DeepSeek API-KEY',
    google: 'Google API-KEY',
  };
  return labels[llm.value.platform] || 'API-KEY';
}

// 获取API-KEY占位符
function getApiKeyPlaceholder() {
  const placeholders = {
    aliyun: '请输入阿里云 API-KEY',
    deepseek: '请输入 DeepSeek API-KEY',
    google: '请输入 Google API-KEY',
  };
  return placeholders[llm.value.platform] || '请输入 API-KEY';
}
</script>

<style scoped>
.settings-page {
  padding: 0 16px 16px 16px;
  height: 100%;
  background: #1a1a1a;
  color: #fff;
  overflow-y: auto;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px 0;
}

.settings-tabs {
  margin-top: 8px;
}

.settings-tabs :deep(.n-tabs-nav) {
  background: transparent;
  border-bottom: 1px solid #2d2d2d;
}

.settings-tabs :deep(.n-tab-pane) {
  padding: 0;
}

.settings-tabs :deep(.n-tabs-tab) {
  color: #888;
  padding: 10px 12px;
  font-size: 12px;
}

.settings-tabs :deep(.n-tabs-tab--active) {
  color: #00bcd4;
  border-bottom: 2px solid #00bcd4;
}

.settings-content {
  padding: 12px 0;
}

.settings-section {
  background: #1e1e1e;
  border: 1px solid #2d2d2d;
  border-radius: 6px;
  margin-bottom: 12px;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #2d2d2d;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

.doc-link {
  font-size: 11px;
  color: #00bcd4;
  text-decoration: none;
  transition: color 0.2s;
}

.doc-link:hover {
  color: #00acc1;
}

.section-body {
  padding: 12px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 11px;
  color: #ccc;
  margin-bottom: 6px;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.radio-group :deep(.n-radio) {
  color: #ccc;
}

.radio-group :deep(.n-radio--checked) {
  color: #00bcd4;
}

.radio-group :deep(.n-radio__dot) {
  border-color: #2d2d2d;
}

.radio-group :deep(.n-radio--checked .n-radio__dot) {
  border-color: #00bcd4;
  background: #00bcd4;
}

.input-with-button {
  display: flex;
  gap: 8px;
  align-items: center;
}

.server-input {
  flex: 1;
}

.form-input {
  width: 100%;
}

.input-with-icon {
  position: relative;
  width: 100%;
}

.test-btn {
  background: #00bcd4;
  border-color: #00bcd4;
  white-space: nowrap;
}

.test-btn:hover {
  background: #00acc1;
  border-color: #00acc1;
}

.empty-tab {
  padding: 40px;
  text-align: center;
  color: #888;
  font-size: 14px;
}

/* Switch 样式 */
:deep(.n-switch) {
  --n-switch-color: #764ba2;
}

:deep(.n-switch--checked) {
  --n-switch-color: #764ba2;
}

/* Input 样式 */
:deep(.n-input) {
  background: #1a1a1a;
  border-color: #2d2d2d;
  color: #fff;
}

:deep(.n-input:focus) {
  border-color: #00bcd4;
}

:deep(.n-input__input-el) {
  color: #fff;
}

:deep(.n-input__input-el::placeholder) {
  color: #666;
}
</style>

