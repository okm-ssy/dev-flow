import type { NodeTemplate } from '../types';

export const nodeTemplates: Record<string, NodeTemplate> = {
  input: {
    label: '事前準備',
    icon: 'FileText',
    defaultConfig: {
      source: 'file',
      path: '',
    },
    outputs: [{ id: 'output', label: 'Data' }],
  },
  process: {
    label: '手作業',
    icon: 'Code',
    defaultConfig: {
      operation: 'transform',
    },
    inputs: [{ id: 'input', label: 'Input' }],
    outputs: [{ id: 'output', label: 'Output' }],
  },
  condition: {
    label: '条件分岐',
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
    label: 'SQL 実行',
    icon: 'Database',
    defaultConfig: {
      type: 'postgres',
      query: '',
    },
    inputs: [{ id: 'query', label: 'Query' }],
    outputs: [{ id: 'result', label: 'Result' }],
  },
  api: {
    label: 'API 実行',
    icon: 'Globe',
    defaultConfig: {
      method: 'GET',
      url: '',
    },
    inputs: [{ id: 'params', label: 'Parameters' }],
    outputs: [{ id: 'response', label: 'Response' }],
  },
  script: {
    label: 'CLI 実行',
    icon: 'Terminal',
    defaultConfig: {
      language: 'javascript',
      code: '// Your script here\n',
    },
    inputs: [{ id: 'input', label: 'Input' }],
    outputs: [{ id: 'output', label: 'Output' }],
  },
};
