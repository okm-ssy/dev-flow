import { z } from 'zod';

// Base node data schema
export const BaseNodeDataSchema = z.object({
  id: z.string(),
  type: z.enum(['bigquery', 'postgresql', 'aws', 'slack', 'custom']),
  title: z.string(),
  description: z.string(),
  code: z.string(),
  inputs: z.array(z.string()),
  outputs: z.array(z.string()),
  notes: z.string().optional(),
  language: z.string().optional(),
});

// Workflow node schema
export const WorkflowNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: BaseNodeDataSchema,
});

// Edge schema
export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
});

// Workflow schema
export const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Workflow name is required'),
  description: z.string(),
  nodes: z.array(WorkflowNodeSchema),
  edges: z.array(EdgeSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create workflow request schema
export const CreateWorkflowSchema = WorkflowSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update workflow request schema  
export const UpdateWorkflowSchema = WorkflowSchema.omit({
  createdAt: true,
  updatedAt: true,
}).partial().extend({
  id: z.string(), // ID is required for updates
});

// TypeScript types
export type BaseNodeData = z.infer<typeof BaseNodeDataSchema>;
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;
export type Edge = z.infer<typeof EdgeSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;
export type CreateWorkflowRequest = z.infer<typeof CreateWorkflowSchema>;
export type UpdateWorkflowRequest = z.infer<typeof UpdateWorkflowSchema>;

// Database model (includes additional fields for storage)
export interface WorkflowRecord {
  id: string;
  name: string;
  description: string;
  data: string; // JSON stringified workflow data
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: 'name' | 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}