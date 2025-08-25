import type { Workflow, WorkflowData } from '../types';

const API_BASE_URL = '/api';

export const api = {
  async listWorkflows(): Promise<Workflow[]> {
    const response = await fetch(`${API_BASE_URL}/workflows`);
    if (!response.ok) throw new Error('Failed to fetch workflows');
    return response.json();
  },

  async getWorkflow(id: string): Promise<Workflow> {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`);
    if (!response.ok) throw new Error('Failed to fetch workflow');
    return response.json();
  },

  async createWorkflow(data: WorkflowData): Promise<Workflow> {
    const response = await fetch(`${API_BASE_URL}/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create workflow');
    return response.json();
  },

  async updateWorkflow(id: string, data: Partial<WorkflowData>): Promise<Workflow> {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update workflow');
    return response.json();
  },

  async deleteWorkflow(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/workflows/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete workflow');
  },
};
