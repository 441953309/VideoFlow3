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
  
  // 创建 storyboards 表（分镜表）
  await db.execute(`
    CREATE TABLE IF NOT EXISTS storyboards (
      storyboardId INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL,
      sequenceNumber INTEGER NOT NULL,
      description TEXT,
      imagePrompt TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE
    )
  `);
  
  // 创建 dialogues 表（旁白对白表）
  await db.execute(`
    CREATE TABLE IF NOT EXISTS dialogues (
      dialogueId INTEGER PRIMARY KEY AUTOINCREMENT,
      storyboardId INTEGER NOT NULL,
      content TEXT NOT NULL,
      character TEXT,
      tone TEXT,
      sequenceNumber INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (storyboardId) REFERENCES storyboards(storyboardId) ON DELETE CASCADE
    )
  `);
  
  // 创建 scenes 表（场景表）
  await db.execute(`
    CREATE TABLE IF NOT EXISTS scenes (
      sceneId INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL,
      sceneName TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE
    )
  `);
  
  // 创建 characters 表（角色表）
  await db.execute(`
    CREATE TABLE IF NOT EXISTS characters (
      characterId INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL,
      characterName TEXT NOT NULL,
      description TEXT,
      voice TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE
    )
  `);
  
  // 创建 image_models 表（图片模型表）
  await db.execute(`
    CREATE TABLE IF NOT EXISTS image_models (
      modelId INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL,
      modelName TEXT NOT NULL,
      modelPath TEXT,
      apiKey TEXT,
      isDefault INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE
    )
  `);
  
  // 创建 video_models 表（视频模型表）
  await db.execute(`
    CREATE TABLE IF NOT EXISTS video_models (
      modelId INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL,
      modelName TEXT NOT NULL,
      modelPath TEXT,
      apiKey TEXT,
      isDefault INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE
    )
  `);
  
  // 创建 lip_sync_models 表（对口型模型表）
  await db.execute(`
    CREATE TABLE IF NOT EXISTS lip_sync_models (
      modelId INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL,
      modelName TEXT NOT NULL,
      modelPath TEXT,
      apiKey TEXT,
      isDefault INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE
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

/**
 * 分镜相关操作
 */
export const storyboardDb = {
  // 创建分镜
  async create(projectId: number, sequenceNumber: number, description?: string, imagePrompt?: string) {
    const db = await getDb();
    const result = await db.execute(
      'INSERT INTO storyboards (projectId, sequenceNumber, description, imagePrompt) VALUES ($1, $2, $3, $4)',
      [projectId, sequenceNumber, description || null, imagePrompt || null]
    );
    return result.lastInsertId;
  },

  // 获取项目的所有分镜
  async getByProjectId(projectId: number) {
    const db = await getDb();
    return await db.select<Array<{
      storyboardId: number;
      projectId: number;
      sequenceNumber: number;
      description: string | null;
      imagePrompt: string | null;
      created_at: string;
      updated_at: string;
    }>>('SELECT * FROM storyboards WHERE projectId = $1 ORDER BY sequenceNumber ASC', [projectId]);
  },

  // 根据ID获取分镜
  async getById(storyboardId: number) {
    const db = await getDb();
    const result = await db.select<Array<{
      storyboardId: number;
      projectId: number;
      sequenceNumber: number;
      description: string | null;
      imagePrompt: string | null;
      created_at: string;
      updated_at: string;
    }>>('SELECT * FROM storyboards WHERE storyboardId = $1', [storyboardId]);
    return result[0] || null;
  },

  // 更新分镜
  async update(storyboardId: number, sequenceNumber?: number, description?: string, imagePrompt?: string) {
    const db = await getDb();
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (sequenceNumber !== undefined) {
      updates.push(`sequenceNumber = $${paramIndex++}`);
      values.push(sequenceNumber);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (imagePrompt !== undefined) {
      updates.push(`imagePrompt = $${paramIndex++}`);
      values.push(imagePrompt);
    }

    if (updates.length === 0) return;

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(storyboardId);
    
    await db.execute(
      `UPDATE storyboards SET ${updates.join(', ')} WHERE storyboardId = $${paramIndex}`,
      values
    );
  },

  // 更新分镜顺序
  async updateSequence(storyboardId: number, newSequenceNumber: number) {
    const db = await getDb();
    await db.execute(
      'UPDATE storyboards SET sequenceNumber = $1, updated_at = CURRENT_TIMESTAMP WHERE storyboardId = $2',
      [newSequenceNumber, storyboardId]
    );
  },

  // 批量更新分镜顺序
  async updateSequences(updates: Array<{ storyboardId: number; sequenceNumber: number }>) {
    const db = await getDb();
    for (const update of updates) {
      await db.execute(
        'UPDATE storyboards SET sequenceNumber = $1, updated_at = CURRENT_TIMESTAMP WHERE storyboardId = $2',
        [update.sequenceNumber, update.storyboardId]
      );
    }
  },

  // 删除分镜
  async delete(storyboardId: number) {
    const db = await getDb();
    await db.execute('DELETE FROM storyboards WHERE storyboardId = $1', [storyboardId]);
  },
};

/**
 * 旁白对白相关操作
 */
export const dialogueDb = {
  // 创建旁白对白
  async create(storyboardId: number, content: string, character?: string, tone?: string, sequenceNumber?: number) {
    const db = await getDb();
    // 如果没有指定序号，自动获取当前分镜的最大序号+1
    if (sequenceNumber === undefined) {
      const maxResult = await db.select<Array<{ maxSeq: number }>>(
        'SELECT COALESCE(MAX(sequenceNumber), 0) as maxSeq FROM dialogues WHERE storyboardId = $1',
        [storyboardId]
      );
      sequenceNumber = (maxResult[0]?.maxSeq || 0) + 1;
    }
    
    const result = await db.execute(
      'INSERT INTO dialogues (storyboardId, content, character, tone, sequenceNumber) VALUES ($1, $2, $3, $4, $5)',
      [storyboardId, content, character || null, tone || null, sequenceNumber]
    );
    return result.lastInsertId;
  },

  // 获取分镜的所有旁白对白
  async getByStoryboardId(storyboardId: number) {
    const db = await getDb();
    return await db.select<Array<{
      dialogueId: number;
      storyboardId: number;
      content: string;
      character: string | null;
      tone: string | null;
      sequenceNumber: number;
      created_at: string;
      updated_at: string;
    }>>('SELECT * FROM dialogues WHERE storyboardId = $1 ORDER BY sequenceNumber ASC', [storyboardId]);
  },

  // 根据ID获取旁白对白
  async getById(dialogueId: number) {
    const db = await getDb();
    const result = await db.select<Array<{
      dialogueId: number;
      storyboardId: number;
      content: string;
      character: string | null;
      tone: string | null;
      sequenceNumber: number;
      created_at: string;
      updated_at: string;
    }>>('SELECT * FROM dialogues WHERE dialogueId = $1', [dialogueId]);
    return result[0] || null;
  },

  // 更新旁白对白
  async update(dialogueId: number, content?: string, character?: string, tone?: string, sequenceNumber?: number) {
    const db = await getDb();
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (content !== undefined) {
      updates.push(`content = $${paramIndex++}`);
      values.push(content);
    }
    if (character !== undefined) {
      updates.push(`character = $${paramIndex++}`);
      values.push(character);
    }
    if (tone !== undefined) {
      updates.push(`tone = $${paramIndex++}`);
      values.push(tone);
    }
    if (sequenceNumber !== undefined) {
      updates.push(`sequenceNumber = $${paramIndex++}`);
      values.push(sequenceNumber);
    }

    if (updates.length === 0) return;

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(dialogueId);
    
    await db.execute(
      `UPDATE dialogues SET ${updates.join(', ')} WHERE dialogueId = $${paramIndex}`,
      values
    );
  },

  // 删除旁白对白
  async delete(dialogueId: number) {
    const db = await getDb();
    await db.execute('DELETE FROM dialogues WHERE dialogueId = $1', [dialogueId]);
  },
};

/**
 * 场景相关操作
 */
export const sceneDb = {
  async create(projectId: number, sceneName: string, description?: string) {
    const db = await getDb();
    const result = await db.execute(
      'INSERT INTO scenes (projectId, sceneName, description) VALUES ($1, $2, $3)',
      [projectId, sceneName, description || null]
    );
    return result.lastInsertId;
  },

  async getByProjectId(projectId: number) {
    const db = await getDb();
    return await db.select<Array<{
      sceneId: number;
      projectId: number;
      sceneName: string;
      description: string | null;
      created_at: string;
      updated_at: string;
    }>>('SELECT * FROM scenes WHERE projectId = $1 ORDER BY created_at DESC', [projectId]);
  },

  async update(sceneId: number, sceneName: string, description?: string) {
    const db = await getDb();
    await db.execute(
      'UPDATE scenes SET sceneName = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE sceneId = $3',
      [sceneName, description || null, sceneId]
    );
  },

  async delete(sceneId: number) {
    const db = await getDb();
    await db.execute('DELETE FROM scenes WHERE sceneId = $1', [sceneId]);
  },
};

/**
 * 角色相关操作
 */
export const characterDb = {
  async create(projectId: number, characterName: string, description?: string, voice?: string) {
    const db = await getDb();
    const result = await db.execute(
      'INSERT INTO characters (projectId, characterName, description, voice) VALUES ($1, $2, $3, $4)',
      [projectId, characterName, description || null, voice || null]
    );
    return result.lastInsertId;
  },

  async getByProjectId(projectId: number) {
    const db = await getDb();
    return await db.select<Array<{
      characterId: number;
      projectId: number;
      characterName: string;
      description: string | null;
      voice: string | null;
      created_at: string;
      updated_at: string;
    }>>('SELECT * FROM characters WHERE projectId = $1 ORDER BY created_at DESC', [projectId]);
  },

  async update(characterId: number, characterName: string, description?: string, voice?: string) {
    const db = await getDb();
    await db.execute(
      'UPDATE characters SET characterName = $1, description = $2, voice = $3, updated_at = CURRENT_TIMESTAMP WHERE characterId = $4',
      [characterName, description || null, voice || null, characterId]
    );
  },

  async delete(characterId: number) {
    const db = await getDb();
    await db.execute('DELETE FROM characters WHERE characterId = $1', [characterId]);
  },
};

/**
 * 图片模型相关操作
 */
export const imageModelDb = {
  async create(projectId: number, modelName: string, modelPath?: string, apiKey?: string) {
    const db = await getDb();
    const result = await db.execute(
      'INSERT INTO image_models (projectId, modelName, modelPath, apiKey) VALUES ($1, $2, $3, $4)',
      [projectId, modelName, modelPath || null, apiKey || null]
    );
    return result.lastInsertId;
  },

  async getByProjectId(projectId: number) {
    const db = await getDb();
    return await db.select<Array<{
      modelId: number;
      projectId: number;
      modelName: string;
      modelPath: string | null;
      apiKey: string | null;
      isDefault: number;
      created_at: string;
      updated_at: string;
    }>>('SELECT * FROM image_models WHERE projectId = $1 ORDER BY isDefault DESC, created_at DESC', [projectId]);
  },

  async update(modelId: number, modelName: string, modelPath?: string, apiKey?: string) {
    const db = await getDb();
    await db.execute(
      'UPDATE image_models SET modelName = $1, modelPath = $2, apiKey = $3, updated_at = CURRENT_TIMESTAMP WHERE modelId = $4',
      [modelName, modelPath || null, apiKey || null, modelId]
    );
  },

  async setDefault(projectId: number, modelId: number) {
    const db = await getDb();
    // 先取消所有默认
    await db.execute('UPDATE image_models SET isDefault = 0 WHERE projectId = $1', [projectId]);
    // 设置新的默认
    await db.execute('UPDATE image_models SET isDefault = 1, updated_at = CURRENT_TIMESTAMP WHERE modelId = $1', [modelId]);
  },

  async delete(modelId: number) {
    const db = await getDb();
    await db.execute('DELETE FROM image_models WHERE modelId = $1', [modelId]);
  },
};

/**
 * 视频模型相关操作
 */
export const videoModelDb = {
  async create(projectId: number, modelName: string, modelPath?: string, apiKey?: string) {
    const db = await getDb();
    const result = await db.execute(
      'INSERT INTO video_models (projectId, modelName, modelPath, apiKey) VALUES ($1, $2, $3, $4)',
      [projectId, modelName, modelPath || null, apiKey || null]
    );
    return result.lastInsertId;
  },

  async getByProjectId(projectId: number) {
    const db = await getDb();
    return await db.select<Array<{
      modelId: number;
      projectId: number;
      modelName: string;
      modelPath: string | null;
      apiKey: string | null;
      isDefault: number;
      created_at: string;
      updated_at: string;
    }>>('SELECT * FROM video_models WHERE projectId = $1 ORDER BY isDefault DESC, created_at DESC', [projectId]);
  },

  async update(modelId: number, modelName: string, modelPath?: string, apiKey?: string) {
    const db = await getDb();
    await db.execute(
      'UPDATE video_models SET modelName = $1, modelPath = $2, apiKey = $3, updated_at = CURRENT_TIMESTAMP WHERE modelId = $4',
      [modelName, modelPath || null, apiKey || null, modelId]
    );
  },

  async setDefault(projectId: number, modelId: number) {
    const db = await getDb();
    // 先取消所有默认
    await db.execute('UPDATE video_models SET isDefault = 0 WHERE projectId = $1', [projectId]);
    // 设置新的默认
    await db.execute('UPDATE video_models SET isDefault = 1, updated_at = CURRENT_TIMESTAMP WHERE modelId = $1', [modelId]);
  },

  async delete(modelId: number) {
    const db = await getDb();
    await db.execute('DELETE FROM video_models WHERE modelId = $1', [modelId]);
  },
};

/**
 * 对口型模型相关操作
 */
export const lipSyncModelDb = {
  async create(projectId: number, modelName: string, modelPath?: string, apiKey?: string) {
    const db = await getDb();
    const result = await db.execute(
      'INSERT INTO lip_sync_models (projectId, modelName, modelPath, apiKey) VALUES ($1, $2, $3, $4)',
      [projectId, modelName, modelPath || null, apiKey || null]
    );
    return result.lastInsertId;
  },

  async getByProjectId(projectId: number) {
    const db = await getDb();
    return await db.select<Array<{
      modelId: number;
      projectId: number;
      modelName: string;
      modelPath: string | null;
      apiKey: string | null;
      isDefault: number;
      created_at: string;
      updated_at: string;
    }>>('SELECT * FROM lip_sync_models WHERE projectId = $1 ORDER BY isDefault DESC, created_at DESC', [projectId]);
  },

  async update(modelId: number, modelName: string, modelPath?: string, apiKey?: string) {
    const db = await getDb();
    await db.execute(
      'UPDATE lip_sync_models SET modelName = $1, modelPath = $2, apiKey = $3, updated_at = CURRENT_TIMESTAMP WHERE modelId = $4',
      [modelName, modelPath || null, apiKey || null, modelId]
    );
  },

  async setDefault(projectId: number, modelId: number) {
    const db = await getDb();
    // 先取消所有默认
    await db.execute('UPDATE lip_sync_models SET isDefault = 0 WHERE projectId = $1', [projectId]);
    // 设置新的默认
    await db.execute('UPDATE lip_sync_models SET isDefault = 1, updated_at = CURRENT_TIMESTAMP WHERE modelId = $1', [modelId]);
  },

  async delete(modelId: number) {
    const db = await getDb();
    await db.execute('DELETE FROM lip_sync_models WHERE modelId = $1', [modelId]);
  },
};

