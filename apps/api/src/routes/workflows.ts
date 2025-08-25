import { Router } from 'express';
import { WorkflowController } from '../controllers/workflows';

const router = Router();
const workflowController = new WorkflowController();

// GET /api/workflows - Get all workflows (with pagination)
router.get('/', workflowController.getAllWorkflows.bind(workflowController));

// POST /api/workflows - Create new workflow
router.post('/', workflowController.createWorkflow.bind(workflowController));

// Export routes (must come before /:id to avoid conflicts)
router.get('/:id/export/markdown', workflowController.exportWorkflowMarkdown.bind(workflowController));
router.get('/:id/export/json', workflowController.exportWorkflowJSON.bind(workflowController));

// GET /api/workflows/:id - Get workflow by ID
router.get('/:id', workflowController.getWorkflowById.bind(workflowController));

// PUT /api/workflows/:id - Update workflow
router.put('/:id', workflowController.updateWorkflow.bind(workflowController));

// DELETE /api/workflows/:id - Delete workflow
router.delete('/:id', workflowController.deleteWorkflow.bind(workflowController));

export { router as workflowRoutes };