import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const validationTools: Tool[] = [
  {
    name: 'validate_workflow',
    description: 'Validate workflow structure and identify potential issues or improvements',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Workflow ID to validate',
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
  },
];