import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const exportTools: Tool[] = [
  {
    name: 'export_markdown',
    description: 'Export a workflow as Markdown documentation (GitHub wiki compatible)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Workflow ID to export',
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
  },
  {
    name: 'export_json',
    description: 'Export a workflow as structured JSON data',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Workflow ID to export',
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
  },
];