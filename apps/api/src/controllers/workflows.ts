import { Request, Response, NextFunction } from 'express';
import { fileStorage } from '../services/file-storage';
import { 
  CreateWorkflowSchema, 
  UpdateWorkflowSchema, 
  ApiResponse,
  Workflow,
  WorkflowNode,
  Edge,
  PaginationParams 
} from '../models/types';
import { ZodError } from 'zod';

export class WorkflowController {
  // Get all workflows with pagination
  async getAllWorkflows(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 50, sort = 'updatedAt', order = 'desc' }: PaginationParams = req.query;
      
      const workflows = await fileStorage.getAllWorkflows(
        Number(page), 
        Number(limit), 
        sort as 'name' | 'createdAt' | 'updatedAt', 
        order as 'asc' | 'desc'
      );
      
      const totalCount = await fileStorage.getWorkflowCount();
      const totalPages = Math.ceil(totalCount / Number(limit));

      const response: ApiResponse = {
        success: true,
        data: {
          workflows: workflows.map(w => ({
            id: w.id,
            name: w.name,
            description: w.description,
            createdAt: w.createdAt,
            updatedAt: w.updatedAt,
          })),
          pagination: {
            page: Number(page),
            limit: Number(limit),
            totalCount,
            totalPages,
            hasNext: Number(page) < totalPages,
            hasPrev: Number(page) > 1,
          }
        }
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // Get workflow by ID
  async getWorkflowById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const workflowRecord = await fileStorage.getWorkflowById(id);
      
      if (!workflowRecord) {
        const response: ApiResponse = {
          success: false,
          error: 'Workflow not found'
        };
        return res.status(404).json(response);
      }

      // Parse the stored JSON data back to workflow object
      const workflowData = JSON.parse(workflowRecord.data);
      const workflow: Workflow = {
        ...workflowData,
        createdAt: new Date(workflowRecord.createdAt),
        updatedAt: new Date(workflowRecord.updatedAt),
      };

      const response: ApiResponse = {
        success: true,
        data: workflow
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // Create new workflow
  async createWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const createData = CreateWorkflowSchema.parse(req.body);
      
      // Generate ID and timestamps
      const id = `workflow-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const now = new Date();
      
      const workflow: Workflow = {
        id,
        ...createData,
        createdAt: now,
        updatedAt: now,
      };

      // Store in fileStorage
      await fileStorage.createWorkflow({
        id,
        name: workflow.name,
        description: workflow.description,
        data: JSON.stringify(workflow),
      });

      const response: ApiResponse = {
        success: true,
        data: workflow,
        message: 'Workflow created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          error: 'Validation error',
          data: error.errors
        };
        return res.status(400).json(response);
      }
      next(error);
    }
  }

  // Update workflow
  async updateWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // Validate input
      const updateData = UpdateWorkflowSchema.parse({ ...req.body, id });
      
      // Get existing workflow
      const existingRecord = await fileStorage.getWorkflowById(id);
      if (!existingRecord) {
        const response: ApiResponse = {
          success: false,
          error: 'Workflow not found'
        };
        return res.status(404).json(response);
      }

      const existingWorkflow = JSON.parse(existingRecord.data);
      
      // Create updated workflow
      const updatedWorkflow: Workflow = {
        ...existingWorkflow,
        ...updateData,
        updatedAt: new Date(),
      };

      // Update in fileStorage
      await fileStorage.updateWorkflow(id, {
        name: updatedWorkflow.name,
        description: updatedWorkflow.description,
        data: JSON.stringify(updatedWorkflow),
      });

      const response: ApiResponse = {
        success: true,
        data: updatedWorkflow,
        message: 'Workflow updated successfully'
      };

      res.json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          error: 'Validation error',
          data: error.errors
        };
        return res.status(400).json(response);
      }
      next(error);
    }
  }

  // Delete workflow
  async deleteWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const deleted = await fileStorage.deleteWorkflow(id);
      
      if (!deleted) {
        const response: ApiResponse = {
          success: false,
          error: 'Workflow not found'
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Workflow deleted successfully'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // Export workflow as markdown
  async exportWorkflowMarkdown(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const workflowRecord = await fileStorage.getWorkflowById(id);
      
      if (!workflowRecord) {
        const response: ApiResponse = {
          success: false,
          error: 'Workflow not found'
        };
        return res.status(404).json(response);
      }

      const workflowData = JSON.parse(workflowRecord.data);
      
      // Generate markdown
      let markdown = `# ${workflowData.name}\n\n`;
      markdown += `## 概要\n${workflowData.description || 'No description'}\n\n`;
      markdown += `## ステップ\n\n`;

      workflowData.nodes.forEach((node: WorkflowNode, index: number) => {
        const nodeData = node.data;
        markdown += `### ${index + 1}. ${nodeData.title}\n\n`;
        
        if (nodeData.description) {
          markdown += `${nodeData.description}\n\n`;
        }

        if (nodeData.code) {
          const language = nodeData.language || 'javascript';
          markdown += `\`\`\`${language}\n${nodeData.code}\n\`\`\`\n\n`;
        }

        if (nodeData.inputs.length > 0) {
          markdown += `**入力**: ${nodeData.inputs.join(', ')}\n`;
        }

        if (nodeData.outputs.length > 0) {
          markdown += `**出力**: ${nodeData.outputs.join(', ')}\n`;
        }

        markdown += '\n';
      });

      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${workflowData.name}.md"`);
      res.send(markdown);
    } catch (error) {
      next(error);
    }
  }

  // Export workflow as JSON
  async exportWorkflowJSON(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const workflowRecord = await fileStorage.getWorkflowById(id);
      
      if (!workflowRecord) {
        const response: ApiResponse = {
          success: false,
          error: 'Workflow not found'
        };
        return res.status(404).json(response);
      }

      const workflowData = JSON.parse(workflowRecord.data);
      
      const exportData = {
        workflow: {
          id: workflowData.id,
          name: workflowData.name,
          description: workflowData.description,
          nodes: workflowData.nodes.map((node: WorkflowNode) => ({
            id: node.id,
            type: node.data.type,
            title: node.data.title,
            description: node.data.description,
            code: node.data.code,
            inputs: node.data.inputs,
            outputs: node.data.outputs,
            position: node.position,
          })),
          connections: workflowData.edges.map((edge: Edge) => ({
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle,
          })),
          createdAt: workflowRecord.createdAt,
          updatedAt: workflowRecord.updatedAt,
        },
      };

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${workflowData.name}.json"`);
      res.json(exportData);
    } catch (error) {
      next(error);
    }
  }
}