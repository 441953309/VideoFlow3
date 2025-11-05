/**
 * 获取数据库文件路径的工具函数
 * 
 * 注意：在 Tauri 应用中，数据库文件会自动存储在应用数据目录中
 * 使用 @tauri-apps/plugin-sql 时，路径格式为 "sqlite:filename.db"
 */

import { appConfigDir } from '@tauri-apps/api/path';

/**
 * 获取数据库文件的实际路径
 * @returns 数据库文件的完整路径
 */
export async function getDatabasePath(): Promise<string> {
  try {
    const configDir = await appConfigDir();
    // 数据库文件名
    const dbFileName = 'video_flow.db';
    // 完整路径（注意：路径分隔符可能需要根据操作系统调整）
    const dbPath = `${configDir}${dbFileName}`;
    return dbPath;
  } catch (error) {
    console.error('获取数据库路径失败:', error);
    throw error;
  }
}

/**
 * 获取应用配置目录路径（数据库文件存储位置）
 * @returns 应用配置目录路径
 */
export async function getAppConfigDir(): Promise<string> {
  try {
    const configDir = await appConfigDir();
    return configDir;
  } catch (error) {
    console.error('获取应用配置目录失败:', error);
    throw error;
  }
}

/**
 * 数据库文件存储位置说明
 * 
 * 根据操作系统，数据库文件会存储在应用配置目录（AppConfig）中：
 * 
 * Windows:
 *   %APPDATA%\com.qoo.video-flow\video_flow.db
 *   例如: C:\Users\<用户名>\AppData\Roaming\com.qoo.video-flow\video_flow.db
 * 
 * macOS:
 *   ~/Library/Application Support/com.qoo.video-flow/video_flow.db
 * 
 * Linux:
 *   ~/.config/com.qoo.video-flow/video_flow.db
 * 
 * 应用标识符: com.qoo.video-flow (在 tauri.conf.json 中定义)
 * 
 * 注意：使用 @tauri-apps/plugin-sql 时，使用 "sqlite:filename.db" 格式
 * 数据库文件会自动存储在应用配置目录中
 */

