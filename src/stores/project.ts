import { defineStore } from 'pinia';
import { projectDb } from '../utils/db';
import { getCurrentDateString } from '../utils/date';

export interface Project {
  projectId: number;
  projectName: string;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export const useProjectStore = defineStore('project', {
  state(): ProjectState {
    return {
      projects: [],
      loading: false,
      error: null,
    };
  },

  getters: {
    // 获取所有项目
    allProjects: (state) => state.projects,
    
    // 根据ID获取项目
    getProjectById: (state) => (id: number) => {
      return state.projects.find((p) => p.projectId === id) || null;
    },
    
    // 项目数量
    projectCount: (state) => state.projects.length,
  },

  actions: {
    // 加载所有项目
    async loadProjects() {
      this.loading = true;
      this.error = null;
      try {
        this.projects = await projectDb.getAll();
      } catch (error) {
        this.error = (error as Error).message;
        console.error('加载项目失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 创建项目
    async createProject(projectName?: string) {
      this.loading = true;
      this.error = null;
      try {
        const name = projectName || getCurrentDateString();
        const projectId = await projectDb.create(name);
        // 重新加载项目列表
        await this.loadProjects();
        return projectId;
      } catch (error) {
        this.error = (error as Error).message;
        console.error('创建项目失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 更新项目
    async updateProject(projectId: number, projectName: string) {
      this.loading = true;
      this.error = null;
      try {
        await projectDb.update(projectId, projectName);
        // 重新加载项目列表
        await this.loadProjects();
      } catch (error) {
        this.error = (error as Error).message;
        console.error('更新项目失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 删除项目
    async deleteProject(projectId: number) {
      this.loading = true;
      this.error = null;
      try {
        await projectDb.delete(projectId);
        // 重新加载项目列表
        await this.loadProjects();
      } catch (error) {
        this.error = (error as Error).message;
        console.error('删除项目失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});

