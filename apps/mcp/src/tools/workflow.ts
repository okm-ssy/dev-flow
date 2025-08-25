import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const workflowTools: Tool[] = [
  {
    name: 'list_workflows',
    description: 'List all workflows with pagination support',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
          minimum: 1,
        },
        limit: {
          type: 'number', 
          description: 'Number of workflows per page (default: 20)',
          minimum: 1,
          maximum: 100,
        },
        sort: {
          type: 'string',
          enum: ['name', 'createdAt', 'updatedAt'],
          description: 'Sort by field (default: updatedAt)',
        },
        order: {
          type: 'string',
          enum: ['asc', 'desc'],
          description: 'Sort order (default: desc)',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'get_workflow',
    description: 'Get detailed information about a specific workflow by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Workflow ID',
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
  },
  {
    name: 'create_workflow',
    description: 'Create a new workflow with name, description, and optional initial nodes/edges',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Workflow name',
          minLength: 1,
        },
        description: {
          type: 'string',
          description: 'Workflow description',
          default: '',
        },
        nodes: {
          type: 'array',
          description: 'Initial workflow nodes',
          items: {
            type: 'object',
          },
          default: [],
        },
        edges: {
          type: 'array',
          description: 'Initial workflow edges (connections)',
          items: {
            type: 'object',
          },
          default: [],
        },
      },
      required: ['name'],
      additionalProperties: false,
    },
  },
  {
    name: 'update_workflow',
    description: 'Update workflow properties (name, description, nodes, edges)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Workflow ID',
        },
        name: {
          type: 'string',
          description: 'New workflow name',
        },
        description: {
          type: 'string',
          description: 'New workflow description',
        },
        nodes: {
          type: 'array',
          description: 'Updated workflow nodes',
          items: {
            type: 'object',
          },
        },
        edges: {
          type: 'array',
          description: 'Updated workflow edges',
          items: {
            type: 'object',
          },
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
  },
  {
    name: 'delete_workflow',
    description: 'Delete a workflow permanently',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Workflow ID to delete',
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
  },
];