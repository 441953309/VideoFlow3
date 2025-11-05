import Database from '@tauri-apps/plugin-sql';

// 数据库实例（单例模式）
let dbInstance: Database | null = null;

/**
 * 初始化数据库（创建表结构）
 * 这个函数需要在前端应用启动时调用一次
 */
export async function initDatabase(): Promise<void> {
  const db = await getDb();
  
  // 创建 videos 表
  await db.execute(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      path TEXT NOT NULL,
      duration INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // 创建 tags 表
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // 创建 video_tags 关联表
  await db.execute(`
    CREATE TABLE IF NOT EXISTS video_tags (
      video_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (video_id, tag_id),
      FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `);
  
  // 创建 projects 表
  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      projectId INTEGER PRIMARY KEY AUTOINCREMENT,
      projectName TEXT NOT NULL
    )
  `);
  
  console.log('数据库表初始化完成');
}

/**
 * 获取数据库实例
 * @returns 数据库实例
 */
export async function getDb(): Promise<Database> {
  if (!dbInstance) {
    // 加载数据库，数据库文件会自动创建在应用数据目录
    dbInstance = await Database.load('sqlite:video_flow.db');
  }
  return dbInstance;
}

/**
 * 视频相关操作
 */
export const videoDb = {
  // 创建视频
  async create(title: string, path: string, duration?: number) {
    const db = await getDb();
    const result = await db.execute(
      'INSERT INTO videos (title, path, duration) VALUES ($1, $2, $3)',
      [title, path, duration || null]
    );
    return result.lastInsertId;
  },

  // 获取所有视频
  async getAll() {
    const db = await getDb();
    return await db.select<Array<{
      id: number;
      title: string;
      path: string;
      duration: number | null;
      created_at: string;
      updated_at: string;
    }>>('SELECT * FROM videos ORDER BY created_at DESC');
  },

  // 根据ID获取视频
  async getById(id: number) {
    const db = await getDb();
    const result = await db.select<Array<{
      id: number;
      title: string;
      path: string;
      duration: number | null;
      created_at: string;
      updated_at: string;
    }>>('SELECT * FROM videos WHERE id = $1', [id]);
    return result[0] || null;
  },

  // 更新视频
  async update(id: number, title: string, path: string, duration?: number) {
    const db = await getDb();
    await db.execute(
      'UPDATE videos SET title = $1, path = $2, duration = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
      [title, path, duration || null, id]
    );
  },

  // 删除视频
  async delete(id: number) {
    const db = await getDb();
    await db.execute('DELETE FROM videos WHERE id = $1', [id]);
  },
};

/**
 * 标签相关操作
 */
export const tagDb = {
  // 创建标签（如果已存在则返回现有标签ID）
  async create(name: string) {
    const db = await getDb();
    // 先尝试插入
    try {
      await db.execute('INSERT INTO tags (name) VALUES ($1)', [name]);
    } catch (error) {
      // 如果已存在，忽略错误
    }
    // 获取标签ID
    const result = await db.select<Array<{ id: number }>>(
      'SELECT id FROM tags WHERE name = $1',
      [name]
    );
    return result[0]?.id;
  },

  // 获取所有标签
  async getAll() {
    const db = await getDb();
    return await db.select<Array<{
      id: number;
      name: string;
      created_at: string;
    }>>('SELECT * FROM tags ORDER BY name');
  },

  // 为视频添加标签
  async addToVideo(videoId: number, tagId: number) {
    const db = await getDb();
    try {
      await db.execute(
        'INSERT INTO video_tags (video_id, tag_id) VALUES ($1, $2)',
        [videoId, tagId]
      );
    } catch (error) {
      // 如果已存在，忽略错误
    }
  },

  // 移除视频标签
  async removeFromVideo(videoId: number, tagId: number) {
    const db = await getDb();
    await db.execute(
      'DELETE FROM video_tags WHERE video_id = $1 AND tag_id = $2',
      [videoId, tagId]
    );
  },

  // 获取视频的所有标签
  async getByVideoId(videoId: number) {
    const db = await getDb();
    return await db.select<Array<{
      id: number;
      name: string;
      created_at: string;
    }>>(
      `SELECT t.* FROM tags t 
       INNER JOIN video_tags vt ON t.id = vt.tag_id 
       WHERE vt.video_id = $1 
       ORDER BY t.name`,
      [videoId]
    );
  },
};

/**
 * 执行原始SQL查询（用于复杂查询）
 */
export async function executeSql<T = any>(
  sql: string,
  bindValues?: any[]
): Promise<T[]> {
  const db = await getDb();
  const result = await db.select<T>(sql, bindValues);
  return Array.isArray(result) ? result : [];
}

/**
 * 执行原始SQL命令（用于 INSERT、UPDATE、DELETE）
 */
export async function executeCommand(
  sql: string,
  bindValues?: any[]
): Promise<{ lastInsertId: number; rowsAffected: number }> {
  const db = await getDb();
  const result = await db.execute(sql, bindValues);
  return {
    lastInsertId: result.lastInsertId || 0,
    rowsAffected: result.rowsAffected || 0,
  };
}

/**
 * 项目相关操作
 */
export const projectDb = {
  // 创建项目
  async create(projectName: string) {
    const db = await getDb();
    const result = await db.execute(
      'INSERT INTO projects (projectName) VALUES ($1)',
      [projectName]
    );
    return result.lastInsertId;
  },

  // 获取所有项目
  async getAll() {
    const db = await getDb();
    return await db.select<Array<{
      projectId: number;
      projectName: string;
    }>>('SELECT * FROM projects ORDER BY projectId DESC');
  },

  // 根据ID获取项目
  async getById(projectId: number) {
    const db = await getDb();
    const result = await db.select<Array<{
      projectId: number;
      projectName: string;
    }>>('SELECT * FROM projects WHERE projectId = $1', [projectId]);
    return result[0] || null;
  },

  // 更新项目
  async update(projectId: number, projectName: string) {
    const db = await getDb();
    await db.execute(
      'UPDATE projects SET projectName = $1 WHERE projectId = $2',
      [projectName, projectId]
    );
  },

  // 删除项目
  async delete(projectId: number) {
    const db = await getDb();
    await db.execute('DELETE FROM projects WHERE projectId = $1', [projectId]);
  },
};

