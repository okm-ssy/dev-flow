import { Router } from 'express';
import { ProjectController } from '../controllers/projects';

const router = Router();
const projectController = new ProjectController();

// Get all projects
router.get('/', projectController.getAllProjects.bind(projectController));

// Get specific project
router.get('/:id', projectController.getProject.bind(projectController));

// Save/update project
router.post('/', projectController.saveProject.bind(projectController));

// Delete project
router.delete('/:id', projectController.deleteProject.bind(projectController));

export { router as projectRoutes };