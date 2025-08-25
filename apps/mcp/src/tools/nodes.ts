import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const nodeTools: Tool[] = [
  {
    name: 'add_node',
    description: 'Add a new node to a workflow',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to add the node to',
        },
        nodeData: {
          type: 'object',
          description: 'Node configuration data',
          properties: {
            type: {
              type: 'string',
              enum: ['bigquery', 'postgresql', 'aws', 'slack', 'custom'],
              description: 'Node type',
              default: 'custom',
            },
            title: {
              type: 'string',
              description: 'Node title/name',
              default: 'New Node',
            },
            description: {
              type: 'string',
              description: 'Node description',
              default: '',
            },
            code: {
              type: 'string',
              description: 'Code content for the node',
              default: '',
            },
            language: {
              type: 'string',
              description: 'Programming language for syntax highlighting',
              default: 'javascript',
            },
            inputs: {
              type: 'array',
              description: 'Input parameters',
              items: {
                type: 'string',
              },
              default: [],
            },
            outputs: {
              type: 'array',
              description: 'Output parameters',
              items: {
                type: 'string',
              },
              default: [],
            },
            position: {
              type: 'object',
              description: 'Node position on canvas',
              properties: {
                x: {
                  type: 'number',
                  default: 100,
                },
                y: {
                  type: 'number',
                  default: 100,
                },
              },
              default: { x: 100, y: 100 },
            },
          },
          required: ['title'],
        },
      },
      required: ['workflowId', 'nodeData'],
      additionalProperties: false,
    },
  },
  {
    name: 'update_node',
    description: 'Update properties of an existing node in a workflow',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow containing the node',
        },
        nodeId: {
          type: 'string',
          description: 'ID of the node to update',
        },
        updates: {
          type: 'object',
          description: 'Properties to update',
          properties: {
            title: {
              type: 'string',
              description: 'New node title',
            },
            description: {
              type: 'string',
              description: 'New node description',
            },
            code: {
              type: 'string',
              description: 'New code content',
            },
            language: {
              type: 'string',
              description: 'New programming language',
            },
            inputs: {
              type: 'array',
              description: 'New input parameters',
              items: {
                type: 'string',
              },
            },
            outputs: {
              type: 'array',
              description: 'New output parameters',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
      required: ['workflowId', 'nodeId', 'updates'],
      additionalProperties: false,
    },
  },
  {
    name: 'delete_node',
    description: 'Delete a node from a workflow (also removes connected edges)',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow containing the node',
        },
        nodeId: {
          type: 'string',
          description: 'ID of the node to delete',
        },
      },
      required: ['workflowId', 'nodeId'],
      additionalProperties: false,
    },
  },
];