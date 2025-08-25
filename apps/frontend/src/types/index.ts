export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: Position;
  data: {
    label: string;
    type: string;
    config?: Record<string, unknown>;
    inputs?: Array<{ id: string; label: string }>;
    outputs?: Array<{ id: string; label: string }>;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

export type WorkflowData = Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>;

export interface NodeTemplate {
  label: string;
  icon: string;
  defaultConfig?: Record<string, unknown>;
  inputs?: Array<{ id: string; label: string }>;
  outputs?: Array<{ id: string; label: string }>;
}
