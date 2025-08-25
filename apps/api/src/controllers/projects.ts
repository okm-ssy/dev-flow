import { Request, Response, NextFunction } from 'express';
import { projectStorage } from '../services/project-storage';
import { ApiResponse } from '../models/types';

export class ProjectController {
  // Get all projects
  async getAllProjects(_req: Request, res: Response, next: NextFunction) {
    try {
      const projects = await projectStorage.getAllProjects();
      
      const response: ApiResponse = {
        success: true,
        data: projects
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // Get specific project by ID
  async getProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const project = await projectStorage.getProject(id);
      
      if (!project) {
        const response: ApiResponse = {
          success: false,
          error: 'Project not found'
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse = {
        success: true,
        data: project
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // Save/update project
  async saveProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId, data } = req.body;
      
      if (!projectId || !data) {
        const response: ApiResponse = {
          success: false,
          error: 'Project ID and data are required'
        };
        return res.status(400).json(response);
      }

      await projectStorage.saveProject(projectId, data);

      const response: ApiResponse = {
        success: true,
        message: 'Project saved successfully'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // Delete project
  async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const deleted = await projectStorage.deleteProject(id);
      
      if (!deleted) {
        const response: ApiResponse = {
          success: false,
          error: 'Project not found'
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Project deleted successfully'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}