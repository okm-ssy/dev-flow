import fs from 'fs';
import path from 'path';

interface ProjectData {
  projectId: string;
  nodes: unknown[];
  edges: unknown[];
  currentWorkflow: unknown;
  timestamp: string;
}

interface ProjectSummary {
  id: string;
  nodeCount: number;
  edgeCount: number;
  lastModified: string;
}

class ProjectStorage {
  private dataDir: string;
  private static instance: ProjectStorage | null = null;

  private constructor() {
    // Use data directory at project root level
    this.dataDir = path.join(process.cwd(), '../../data/projects');
  }

  public static getInstance(): ProjectStorage {
    if (!ProjectStorage.instance) {
      ProjectStorage.instance = new ProjectStorage();
    }
    return ProjectStorage.instance;
  }

  public initialize(): void {
    // Ensure data directory exists
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    console.log('📁 Project storage initialized:', this.dataDir);
  }

  private getProjectPath(projectId: string): string {
    return path.join(this.dataDir, `${projectId}.json`);
  }

  public async getAllProjects(): Promise<ProjectSummary[]> {
    const projects: ProjectSummary[] = [];
    
    try {
      const files = fs.readdirSync(this.dataDir);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const projectId = file.replace('.json', '');
          const filePath = this.getProjectPath(projectId);
          
          try {
            const stats = fs.statSync(filePath);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as ProjectData;
            
            projects.push({
              id: projectId,
              nodeCount: data.nodes?.length || 0,
              edgeCount: data.edges?.length || 0,
              lastModified: stats.mtime.toISOString(),
            });
          } catch (err) {
            console.error(`Failed to read project ${projectId}:`, err);
          }
        }
      }
    } catch (err) {
      console.error('Failed to read projects directory:', err);
    }
    
    return projects.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
  }

  public async getProject(projectId: string): Promise<ProjectData | null> {
    const filePath = this.getProjectPath(projectId);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as ProjectData;
    } catch (err) {
      console.error(`Failed to load project ${projectId}:`, err);
      return null;
    }
  }

  public async saveProject(projectId: string, data: ProjectData): Promise<void> {
    const filePath = this.getProjectPath(projectId);
    
    try {
      const projectData = {
        ...data,
        projectId,
        timestamp: new Date().toISOString(),
      };
      
      fs.writeFileSync(filePath, JSON.stringify(projectData, null, 2));
      console.log(`💾 Project saved: ${projectId}`);
    } catch (err) {
      console.error(`Failed to save project ${projectId}:`, err);
      throw err;
    }
  }

  public async deleteProject(projectId: string): Promise<boolean> {
    const filePath = this.getProjectPath(projectId);
    
    if (!fs.existsSync(filePath)) {
      return false;
    }

    try {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Project deleted: ${projectId}`);
      return true;
    } catch (err) {
      console.error(`Failed to delete project ${projectId}:`, err);
      return false;
    }
  }
}

export const projectStorage = ProjectStorage.getInstance();