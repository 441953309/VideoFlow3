<template>
  <div class="settings-page">
    <!-- 标签页导航 -->
    <n-tabs v-model:value="activeTab" type="line" class="settings-tabs">
      <n-tab-pane name="basic" tab="基础设置">
        <div class="settings-content">
          <!-- 图片生成引擎设置 -->
          <div class="settings-section">
            <div class="section-header">
              <h3 class="section-title">图片生成引擎设置</h3>
              <a href="#" class="doc-link">MidJourney账号申请文档</a>
            </div>
            <div class="section-body">
              <div class="form-group">
                <label class="form-label">引擎类型</label>
                <n-radio-group v-model:value="imageEngine.engineType" class="radio-group">
                  <n-radio value="midjourney">MidJourney</n-radio>
                  <n-radio value="comfyui">ComfyUI</n-radio>
                  <n-radio value="webui">WebUI</n-radio>
                </n-radio-group>
              </div>
              <div class="form-group">
                <label class="form-label">服务器类型</label>
                <n-radio-group v-model:value="imageEngine.serverType" class="radio-group">
                  <n-radio value="external">外部服务器</n-radio>
                  <n-radio value="free">字字动画免费服务器</n-radio>
                </n-radio-group>
              </div>
              <div class="form-group">
                <label class="form-label">服务器地址</label>
                <div class="input-with-button">
                  <n-input
                    v-model:value="imageEngine.serverAddress"
                    placeholder="请输入服务器地址"
                    class="server-input"
                  />
                  <n-button type="primary" class="test-btn">测试</n-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 百度翻译API设置 -->
          <div class="settings-section">
            <div class="section-header">
              <h3 class="section-title">百度翻译API设置</h3>
              <a href="#" class="doc-link">百度翻译API-KEY申请文档</a>
            </div>
            <div class="section-body">
              <div class="form-group">
                <label class="form-label">启用翻译</label>
                <n-switch v-model:value="baiduTranslate.enabled" />
              </div>
              <div class="form-group">
                <label class="form-label">APPID</label>
                <n-input
                  v-model:value="baiduTranslate.appId"
                  placeholder="请输入百度翻译APPID"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">APPKEY</label>
                <div class="input-with-icon">
                  <n-input
                    v-model:value="baiduTranslate.appKey"
                    type="password"
                    placeholder="请输入百度翻译APPKEY"
                    class="form-input"
                    show-password-on="click"
                  />
                </div>
              </div>
              <div class="form-group">
                <n-button type="primary" class="test-btn">测试</n-button>
              </div>
            </div>
          </div>

          <!-- 大语言模型设置 -->
          <div class="settings-section">
            <div class="section-header">
              <h3 class="section-title">大语言模型设置</h3>
              <a href="#" class="doc-link">阿里云API-KEY申请文档</a>
            </div>
            <div class="section-body">
              <div class="form-group">
                <label class="form-label">大语言模型平台</label>
                <n-radio-group v-model:value="llm.platform" class="radio-group">
                  <n-radio value="aliyun">阿里云</n-radio>
                  <n-radio value="silicon">硅基流动</n-radio>
                  <n-radio value="deepseek">DeepSeek官方</n-radio>
                  <n-radio value="anthropic">Anthropic</n-radio>
                  <n-radio value="openai">OpenAI</n-radio>
                  <n-radio value="grok">Grok</n-radio>
                  <n-radio value="google">Google</n-radio>
                  <n-radio value="custom">自定义平台</n-radio>
                </n-radio-group>
              </div>
              <div class="form-group">
                <label class="form-label">Google API-KEY</label>
                <div class="input-with-icon">
                  <n-input
                    v-model:value="llm.apiKey"
                    type="password"
                    placeholder="请输入Google API-KEY"
                    class="form-input"
                    show-password-on="click"
                  />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">模型选择</label>
                <n-radio-group v-model:value="llm.model" class="radio-group">
                  <n-radio value="gemini-2.5-pro">gemini-2.5-pro</n-radio>
                  <n-radio value="gemini-2.5-flash">gemini-2.5-flash</n-radio>
                  <n-radio value="gemini-2.0-flash">gemini-2.0-flash</n-radio>
                </n-radio-group>
              </div>
              <div class="form-group">
                <n-button type="primary" class="test-btn">测试</n-button>
              </div>
            </div>
          </div>
        </div>
      </n-tab-pane>
      
      <n-tab-pane name="prompt" tab="提示词设置">
        <div class="settings-content">
          <div class="empty-tab">提示词设置内容</div>
        </div>
      </n-tab-pane>
      
      <n-tab-pane name="visual" tab="视觉理解设置">
        <div class="settings-content">
          <div class="empty-tab">视觉理解设置内容</div>
        </div>
      </n-tab-pane>
      
      <n-tab-pane name="keyframe" tab="关键帧设置">
        <div class="settings-content">
          <div class="empty-tab">关键帧设置内容</div>
        </div>
      </n-tab-pane>
      
      <n-tab-pane name="view" tab="视图设置">
        <div class="settings-content">
          <div class="empty-tab">视图设置内容</div>
        </div>
      </n-tab-pane>
      
      <n-tab-pane name="performance" tab="性能设置">
        <div class="settings-content">
          <div class="empty-tab">性能设置内容</div>
        </div>
      </n-tab-pane>
      
      <n-tab-pane name="audio" tab="音频设置">
        <div class="settings-content">
          <div class="empty-tab">音频设置内容</div>
        </div>
      </n-tab-pane>
      
      <n-tab-pane name="other" tab="其他设置">
        <div class="settings-content">
          <div class="empty-tab">其他设置内容</div>
        </div>
      </n-tab-pane>
      
      <n-tab-pane name="ai-assistant" tab="AI助手设置">
        <div class="settings-content">
          <div class="empty-tab">AI助手设置内容</div>
        </div>
      </n-tab-pane>
      
      <n-tab-pane name="role-scene" tab="角色场景设置">
        <div class="settings-content">
          <div class="empty-tab">角色场景设置内容</div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('basic');

// 图片生成引擎设置
const imageEngine = ref({
  engineType: 'comfyui',
  serverType: 'external',
  serverAddress: 'http://127.0.0.1:8188/',
});

// 百度翻译API设置
const baiduTranslate = ref({
  enabled: true,
  appId: '',
  appKey: '',
});

// 大语言模型设置
const llm = ref({
  platform: 'google',
  apiKey: '',
  model: 'gemini-2.5-pro',
});
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

