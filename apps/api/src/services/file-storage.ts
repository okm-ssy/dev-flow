import fs from 'fs';
import path from 'path';
import { WorkflowRecord } from '../models/types';

class FileStorage {
  private dataDir: string;
  private static instance: FileStorage | null = null;

  private constructor() {
    // Use environment variable or default to root/data
    this.dataDir = process.env.DATA_PATH || path.join(process.cwd(), '../../data/workflows');
  }

  public static getInstance(): FileStorage {
    if (!FileStorage.instance) {
      FileStorage.instance = new FileStorage();
    }
    return FileStorage.instance;
  }

  public initialize(): void {
    // Ensure data directory exists
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    console.log('📁 File storage initialized:', this.dataDir);
  }

  private getWorkflowPath(id: string): string {
    return path.join(this.dataDir, `${id}.json`);
  }

  private getIndexPath(): string {
    return path.join(this.dataDir, 'index.json');
  }

  private loadIndex(): { workflows: Array<{ id: string; name: string; description: string; createdAt: string; updatedAt: string }> } {
    const indexPath = this.getIndexPath();
    if (!fs.existsSync(indexPath)) {
      return { workflows: [] };
    }
    const data = fs.readFileSync(indexPath, 'utf-8');
    return JSON.parse(data);
  }

  private saveIndex(index: { workflows: Array<{ id: string; name: string; description: string; createdAt: string; updatedAt: string }> }): void {
    const indexPath = this.getIndexPath();
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  }

  public getAllWorkflows(page = 1, limit = 50, sort = 'updatedAt', order = 'desc'): WorkflowRecord[] {
    const index = this.loadIndex();
    
    // Sort workflows
    index.workflows.sort((a, b) => {
      const aValue = a[sort as keyof typeof a];
      const bValue = b[sort as keyof typeof b];
      
      if (order === 'desc') {
        return aValue > bValue ? -1 : 1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = index.workflows.slice(start, end);

    // Load full workflow data
    return paginated.map(item => {
      const filePath = this.getWorkflowPath(item.id);
      if (!fs.existsSync(filePath)) {
        return null;
      }
      const data = fs.readFileSync(filePath, 'utf-8');
      const workflow = JSON.parse(data);
      return {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        data: JSON.stringify(workflow),
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt
      };
    }).filter(Boolean) as WorkflowRecord[];
  }

  public getWorkflowCount(): number {
    const index = this.loadIndex();
    return index.workflows.length;
  }

  public getWorkflowById(id: string): WorkflowRecord | null {
    const filePath = this.getWorkflowPath(id);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    const workflow = JSON.parse(data);
    
    return {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      data: JSON.stringify(workflow),
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt
    };
  }

  public createWorkflow(workflow: { id: string; name: string; description: string; data: string }): void {
    const workflowData = JSON.parse(workflow.data);
    const filePath = this.getWorkflowPath(workflow.id);
    
    // Save workflow file
    fs.writeFileSync(filePath, JSON.stringify(workflowData, null, 2));
    
    // Update index
    const index = this.loadIndex();
    index.workflows.push({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      createdAt: workflowData.createdAt,
      updatedAt: workflowData.updatedAt
    });
    this.saveIndex(index);
    
    console.log(`💾 Workflow saved: ${workflow.name} (${workflow.id})`);
  }

  public updateWorkflow(id: string, updates: { name: string; description: string; data: string }): boolean {
    const filePath = this.getWorkflowPath(id);
    
    if (!fs.existsSync(filePath)) {
      return false;
    }

    const workflowData = JSON.parse(updates.data);
    
    // Update workflow file
    fs.writeFileSync(filePath, JSON.stringify(workflowData, null, 2));
    
    // Update index
    const index = this.loadIndex();
    const indexItem = index.workflows.find(w => w.id === id);
    if (indexItem) {
      indexItem.name = updates.name;
      indexItem.description = updates.description;
      indexItem.updatedAt = workflowData.updatedAt;
      this.saveIndex(index);
    }
    
    console.log(`📝 Workflow updated: ${updates.name} (${id})`);
    return true;
  }

  public deleteWorkflow(id: string): boolean {
    const filePath = this.getWorkflowPath(id);
    
    if (!fs.existsSync(filePath)) {
      return false;
    }

    // Delete workflow file
    fs.unlinkSync(filePath);
    
    // Update index
    const index = this.loadIndex();
    index.workflows = index.workflows.filter(w => w.id !== id);
    this.saveIndex(index);
    
    console.log(`🗑️ Workflow deleted: ${id}`);
    return true;
  }

  public close(): void {
    console.log('📁 File storage closed');
  }
}

export const fileStorage = FileStorage.getInstance();