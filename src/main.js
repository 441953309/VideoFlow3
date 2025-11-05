import { createApp } from "vue";
import App from "./App.vue";
import { pinia } from "./stores";
import router from "./router";
import { initDatabase } from "./utils/db";

// 初始化数据库
initDatabase().then(() => {
  // 创建并挂载应用
  const app = createApp(App);
  
  // 使用 Pinia
  app.use(pinia);
  // 使用 Vue Router
  app.use(router);
  
  // 挂载应用
  app.mount("#app");
}).catch((error) => {
  console.error("应用启动失败:", error);
});
