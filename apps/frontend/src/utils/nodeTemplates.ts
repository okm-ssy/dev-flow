import type { NodeTemplate } from '../types';

// Color-grouped node templates (similar colors are placed together)
export const nodeTemplates: Record<string, NodeTemplate> = {
  // White/Gray group
  process: {
    label: '手作業 / Process',
    icon: 'Code',
    defaultConfig: {
      operation: 'transform',
    },
    inputs: [{ id: 'input', label: 'Input' }],
    outputs: [{ id: 'output', label: 'Output' }],
  },

  // Green group
  input: {
    label: '事前準備 / Input',
    icon: 'FileText',
    defaultConfig: {
      source: 'file',
      path: '',
    },
    outputs: [{ id: 'output', label: 'Data' }],
  },

  // Yellow/Orange group
  condition: {
    label: '条件分岐 / Condition',
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
  script: {
    label: 'CLI 実行 / Script',
    icon: 'Terminal',
    defaultConfig: {
      language: 'javascript',
      code: '// Your script here\n',
    },
    inputs: [{ id: 'input', label: 'Input' }],
    outputs: [{ id: 'output', label: 'Output' }],
  },

  // Purple/Indigo group
  database: {
    label: 'SQL 実行 / Database',
    icon: 'Database',
    defaultConfig: {
      type: 'postgres',
      query: '',
    },
    inputs: [{ id: 'query', label: 'Query' }],
    outputs: [{ id: 'result', label: 'Result' }],
  },
  api: {
    label: 'API 実行 / API Call',
    icon: 'Globe',
    defaultConfig: {
      method: 'GET',
      url: '',
    },
    inputs: [{ id: 'params', label: 'Parameters' }],
    outputs: [{ id: 'response', label: 'Response' }],
  },

  // Pink group
  other: {
    label: 'その他 / Other',
    icon: 'Package',
    defaultConfig: {
      description: '',
      notes: '',
    },
    inputs: [{ id: 'input', label: 'Input' }],
    outputs: [{ id: 'output', label: 'Output' }],
  },
};
