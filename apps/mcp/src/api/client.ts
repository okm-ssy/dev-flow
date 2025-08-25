export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface WorkflowSummary {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    id: string;
    type: 'bigquery' | 'postgresql' | 'aws' | 'slack' | 'custom';
    title: string;
    description: string;
    code: string;
    inputs: string[];
    outputs: string[];
    notes?: string;
    language?: string;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface CreateWorkflowRequest {
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface UpdateWorkflowRequest extends Partial<CreateWorkflowRequest> {
  id: string;
}

export interface PaginatedResponse<T> {
  workflows: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class KiroApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; database: string }>> {
    return this.request('/health');
  }

  // Workflow operations
  async getAllWorkflows(params: {
    page?: number;
    limit?: number;
    sort?: 'name' | 'createdAt' | 'updatedAt';
    order?: 'asc' | 'desc';
  } = {}): Promise<ApiResponse<PaginatedResponse<WorkflowSummary>>> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.order) searchParams.set('order', params.order);

    const queryString = searchParams.toString();
    const endpoint = `/workflows${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getWorkflowById(id: string): Promise<ApiResponse<Workflow>> {
    return this.request(`/workflows/${id}`);
  }

  async createWorkflow(workflow: CreateWorkflowRequest): Promise<ApiResponse<Workflow>> {
    return this.request('/workflows', {
      method: 'POST',
      body: workflow,
    });
  }

  async updateWorkflow(id: string, workflow: UpdateWorkflowRequest): Promise<ApiResponse<Workflow>> {
    return this.request(`/workflows/${id}`, {
      method: 'PUT',
      body: workflow,
    });
  }

  async deleteWorkflow(id: string): Promise<ApiResponse<void>> {
    return this.request(`/workflows/${id}`, {
      method: 'DELETE',
    });
  }

  // Export operations
  async exportWorkflowMarkdown(id: string): Promise<Blob> {
    const url = `${this.baseURL}/workflows/${id}/export/markdown`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }
    
    return response.blob();
  }

  async exportWorkflowJSON(id: string): Promise<Blob> {
    const url = `${this.baseURL}/workflows/${id}/export/json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }
    
    return response.blob();
  }
}