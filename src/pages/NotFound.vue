<template>
  <div class="not-found-page">
    <h1>404</h1>
    <p>页面未找到</p>
    <router-link to="/" class="back-link">返回首页</router-link>
  </div>
</template>

<script setup>
// 404 页面
</script>

<style scoped>
.not-found-page {
  padding: 40px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  font-size: 72px;
  color: #999;
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

.back-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.back-link:hover {
  background-color: #0056b3;
}
</style>

