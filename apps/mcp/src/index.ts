#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';

import { KiroApiClient } from './api/client.js';
import { workflowTools } from './tools/workflow.js';
import { nodeTools } from './tools/nodes.js';
import { exportTools } from './tools/export.js';
import { validationTools } from './tools/validation.js';

class KiroMCPServer {
  private server: Server;
  private apiClient: KiroApiClient;

  constructor() {
    this.server = new Server(
      {
        name: process.env.MCP_SERVER_NAME || 'kiro-workflow',
        version: process.env.MCP_SERVER_VERSION || '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize API client
    const apiUrl = process.env.KIRO_API_URL || 'http://localhost:3001/api';
    this.apiClient = new KiroApiClient(apiUrl);

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          ...workflowTools,
          ...nodeTools,
          ...exportTools,
          ...validationTools,
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result: CallToolResult;

        // Workflow operations
        if (name === 'list_workflows') {
          result = await this.handleListWorkflows(args);
        } else if (name === 'get_workflow') {
          result = await this.handleGetWorkflow(args);
        } else if (name === 'create_workflow') {
          result = await this.handleCreateWorkflow(args);
        } else if (name === 'update_workflow') {
          result = await this.handleUpdateWorkflow(args);
        } else if (name === 'delete_workflow') {
          result = await this.handleDeleteWorkflow(args);
        }
        // Node operations
        else if (name === 'add_node') {
          result = await this.handleAddNode(args);
        } else if (name === 'update_node') {
          result = await this.handleUpdateNode(args);
        } else if (name === 'delete_node') {
          result = await this.handleDeleteNode(args);
        }
        // Export operations
        else if (name === 'export_markdown') {
          result = await this.handleExportMarkdown(args);
        } else if (name === 'export_json') {
          result = await this.handleExportJSON(args);
        }
        // Validation operations
        else if (name === 'validate_workflow') {
          result = await this.handleValidateWorkflow(args);
        } else {
          throw new Error(`Unknown tool: ${name}`);
        }

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  // Workflow tool handlers
  private async handleListWorkflows(args: any): Promise<CallToolResult> {
    const { page = 1, limit = 20 } = args;
    const result = await this.apiClient.getAllWorkflows({ page, limit });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result.data, null, 2),
        },
      ],
    };
  }

  private async handleGetWorkflow(args: any): Promise<CallToolResult> {
    const { id } = args;
    if (!id) {
      throw new Error('Workflow ID is required');
    }

    const result = await this.apiClient.getWorkflowById(id);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result.data, null, 2),
        },
      ],
    };
  }

  private async handleCreateWorkflow(args: any): Promise<CallToolResult> {
    const { name, description = '', nodes = [], edges = [] } = args;
    if (!name) {
      throw new Error('Workflow name is required');
    }

    const result = await this.apiClient.createWorkflow({
      name,
      description,
      nodes,
      edges,
    });

    return {
      content: [
        {
          type: 'text',
          text: `✅ Workflow "${name}" created successfully!\n\n${JSON.stringify(result.data, null, 2)}`,
        },
      ],
    };
  }

  private async handleUpdateWorkflow(args: any): Promise<CallToolResult> {
    const { id, ...updates } = args;
    if (!id) {
      throw new Error('Workflow ID is required');
    }

    const result = await this.apiClient.updateWorkflow(id, updates);
    return {
      content: [
        {
          type: 'text',
          text: `✅ Workflow updated successfully!\n\n${JSON.stringify(result.data, null, 2)}`,
        },
      ],
    };
  }

  private async handleDeleteWorkflow(args: any): Promise<CallToolResult> {
    const { id } = args;
    if (!id) {
      throw new Error('Workflow ID is required');
    }

    await this.apiClient.deleteWorkflow(id);
    return {
      content: [
        {
          type: 'text',
          text: `✅ Workflow ${id} deleted successfully!`,
        },
      ],
    };
  }

  // Node tool handlers
  private async handleAddNode(args: any): Promise<CallToolResult> {
    const { workflowId, nodeData } = args;
    if (!workflowId || !nodeData) {
      throw new Error('Workflow ID and node data are required');
    }

    // Get current workflow
    const workflow = await this.apiClient.getWorkflowById(workflowId);
    if (!workflow.success || !workflow.data) {
      throw new Error('Workflow not found');
    }

    // Add node
    const newNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'custom',
      position: nodeData.position || { x: 100, y: 100 },
      data: {
        id: `node-${Date.now()}`,
        type: nodeData.type || 'custom',
        title: nodeData.title || 'New Node',
        description: nodeData.description || '',
        code: nodeData.code || '',
        inputs: nodeData.inputs || [],
        outputs: nodeData.outputs || [],
        language: nodeData.language,
      },
    };

    const updatedWorkflow = {
      ...workflow.data,
      nodes: [...workflow.data.nodes, newNode],
    };

    const result = await this.apiClient.updateWorkflow(workflowId, updatedWorkflow);
    return {
      content: [
        {
          type: 'text',
          text: `✅ Node "${nodeData.title}" added to workflow!\n\nNode ID: ${newNode.id}`,
        },
      ],
    };
  }

  private async handleUpdateNode(args: any): Promise<CallToolResult> {
    const { workflowId, nodeId, updates } = args;
    if (!workflowId || !nodeId) {
      throw new Error('Workflow ID and node ID are required');
    }

    // Get current workflow
    const workflow = await this.apiClient.getWorkflowById(workflowId);
    if (!workflow.success || !workflow.data) {
      throw new Error('Workflow not found');
    }

    // Update node
    const updatedNodes = workflow.data.nodes.map((node: any) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...updates,
          },
        };
      }
      return node;
    });

    const updatedWorkflow = {
      ...workflow.data,
      nodes: updatedNodes,
    };

    await this.apiClient.updateWorkflow(workflowId, updatedWorkflow);
    return {
      content: [
        {
          type: 'text',
          text: `✅ Node ${nodeId} updated successfully!`,
        },
      ],
    };
  }

  private async handleDeleteNode(args: any): Promise<CallToolResult> {
    const { workflowId, nodeId } = args;
    if (!workflowId || !nodeId) {
      throw new Error('Workflow ID and node ID are required');
    }

    // Get current workflow
    const workflow = await this.apiClient.getWorkflowById(workflowId);
    if (!workflow.success || !workflow.data) {
      throw new Error('Workflow not found');
    }

    // Remove node and connected edges
    const updatedNodes = workflow.data.nodes.filter((node: any) => node.id !== nodeId);
    const updatedEdges = workflow.data.edges.filter((edge: any) => 
      edge.source !== nodeId && edge.target !== nodeId
    );

    const updatedWorkflow = {
      ...workflow.data,
      nodes: updatedNodes,
      edges: updatedEdges,
    };

    await this.apiClient.updateWorkflow(workflowId, updatedWorkflow);
    return {
      content: [
        {
          type: 'text',
          text: `✅ Node ${nodeId} and its connections deleted successfully!`,
        },
      ],
    };
  }

  // Export tool handlers
  private async handleExportMarkdown(args: any): Promise<CallToolResult> {
    const { id } = args;
    if (!id) {
      throw new Error('Workflow ID is required');
    }

    const markdown = await this.apiClient.exportWorkflowMarkdown(id);
    const text = await markdown.text();
    
    return {
      content: [
        {
          type: 'text',
          text: `📄 Markdown Export:\n\n${text}`,
        },
      ],
    };
  }

  private async handleExportJSON(args: any): Promise<CallToolResult> {
    const { id } = args;
    if (!id) {
      throw new Error('Workflow ID is required');
    }

    const jsonBlob = await this.apiClient.exportWorkflowJSON(id);
    const jsonText = await jsonBlob.text();
    
    return {
      content: [
        {
          type: 'text',
          text: `📄 JSON Export:\n\n${jsonText}`,
        },
      ],
    };
  }

  // Validation tool handlers
  private async handleValidateWorkflow(args: any): Promise<CallToolResult> {
    const { id } = args;
    if (!id) {
      throw new Error('Workflow ID is required');
    }

    const workflow = await this.apiClient.getWorkflowById(id);
    if (!workflow.success || !workflow.data) {
      throw new Error('Workflow not found');
    }

    const validation = this.validateWorkflowStructure(workflow.data);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(validation, null, 2),
        },
      ],
    };
  }

  private validateWorkflowStructure(workflow: any) {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for nodes without connections
    const connectedNodeIds = new Set();
    workflow.edges.forEach((edge: any) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const orphanNodes = workflow.nodes.filter((node: any) => 
      !connectedNodeIds.has(node.id) && workflow.nodes.length > 1
    );

    if (orphanNodes.length > 0) {
      issues.push(`Found ${orphanNodes.length} orphaned nodes: ${orphanNodes.map((n: any) => n.data.title).join(', ')}`);
    }

    // Check for nodes without proper configuration
    workflow.nodes.forEach((node: any) => {
      if (!node.data.title || node.data.title.trim() === '') {
        issues.push(`Node ${node.id} is missing a title`);
      }
      if (!node.data.code || node.data.code.trim() === '') {
        suggestions.push(`Node ${node.data.title || node.id} could benefit from code implementation`);
      }
    });

    // Check for circular dependencies (basic check)
    const hasCircularDep = this.detectCircularDependencies(workflow.edges);
    if (hasCircularDep) {
      issues.push('Potential circular dependency detected in workflow');
    }

    return {
      valid: issues.length === 0,
      issues,
      suggestions,
      stats: {
        nodeCount: workflow.nodes.length,
        edgeCount: workflow.edges.length,
        orphanNodes: orphanNodes.length,
      }
    };
  }

  private detectCircularDependencies(edges: any[]): boolean {
    // Simple DFS-based cycle detection
    const graph: Record<string, string[]> = {};
    const visited = new Set<string>();
    const recStack = new Set<string>();

    // Build adjacency list
    edges.forEach(edge => {
      if (!graph[edge.source]) graph[edge.source] = [];
      graph[edge.source].push(edge.target);
    });

    // DFS function
    const hasCycle = (node: string): boolean => {
      visited.add(node);
      recStack.add(node);

      const neighbors = graph[node] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycle(neighbor)) return true;
        } else if (recStack.has(neighbor)) {
          return true;
        }
      }

      recStack.delete(node);
      return false;
    };

    // Check all nodes
    for (const node in graph) {
      if (!visited.has(node)) {
        if (hasCycle(node)) return true;
      }
    }

    return false;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🚀 Kiro MCP Server running on stdio');
  }
}

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new KiroMCPServer();
  server.run().catch(console.error);
}