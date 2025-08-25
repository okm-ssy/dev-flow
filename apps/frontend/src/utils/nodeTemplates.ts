import type { NodeTemplate } from '../types';

export const nodeTemplates: Record<string, NodeTemplate> = {
  input: {
    label: 'Input',
    icon: 'FileText',
    defaultConfig: {
      source: 'file',
      path: '',
    },
    outputs: [{ id: 'output', label: 'Data' }],
  },
  process: {
    label: 'Process',
    icon: 'Code',
    defaultConfig: {
      operation: 'transform',
    },
    inputs: [{ id: 'input', label: 'Input' }],
    outputs: [{ id: 'output', label: 'Output' }],
  },
  condition: {
    label: 'Condition',
    icon: 'GitBranch',
    defaultConfig: {
      condition: '',
    },
    inputs: [{ id: 'input', label: 'Input' }],
    outputs: [
      { id: 'true', label: 'True' },
      { id: 'false', label: 'False' },
    ],
  },
  database: {
    label: 'Database',
    icon: 'Database',
    defaultConfig: {
      type: 'postgres',
      query: '',
    },
    inputs: [{ id: 'query', label: 'Query' }],
    outputs: [{ id: 'result', label: 'Result' }],
  },
  output: {
    label: 'Output',
    icon: 'Send',
    defaultConfig: {
      destination: 'console',
    },
    inputs: [{ id: 'data', label: 'Data' }],
  },
  api: {
    label: 'API Call',
    icon: 'Globe',
    defaultConfig: {
      method: 'GET',
      url: '',
    },
    inputs: [{ id: 'params', label: 'Parameters' }],
    outputs: [{ id: 'response', label: 'Response' }],
  },
  script: {
    label: 'Script',
    icon: 'Terminal',
    defaultConfig: {
      language: 'javascript',
      code: '// Your script here\n',
    },
    inputs: [{ id: 'input', label: 'Input' }],
    outputs: [{ id: 'output', label: 'Output' }],
  },
  transform: {
    label: 'Transform',
    icon: 'Package',
    defaultConfig: {
      code: '// Transform function\nreturn data;',
    },
    inputs: [{ id: 'data', label: 'Data' }],
    outputs: [{ id: 'transformed', label: 'Transformed' }],
  },
  trigger: {
    label: 'Trigger',
    icon: 'Zap',
    defaultConfig: {
      type: 'schedule',
      schedule: '0 * * * *',
    },
    outputs: [{ id: 'trigger', label: 'Trigger' }],
  },
};
