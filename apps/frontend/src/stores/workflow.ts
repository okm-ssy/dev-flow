import type { Node, Edge, Connection } from '@vue-flow/core';
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

import { api } from '../services/api';
import type { Workflow, WorkflowNode, WorkflowData } from '../types';

const STORAGE_KEY = 'dev-flow-workflow';

export const useWorkflowStore = defineStore('workflow', () => {
  const nodes = ref<Node[]>([]);
  const edges = ref<Edge[]>([]);
  const currentWorkflow = ref<Workflow | null>(null);
  const workflows = ref<Workflow[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedNode = ref<Node | null>(null);

  const nodeCount = computed(() => nodes.value.length);
  const edgeCount = computed(() => edges.value.length);

  // Save to localStorage whenever nodes or edges change
  function saveToLocalStorage() {
    const data = {
      nodes: nodes.value,
      edges: edges.value,
      currentWorkflow: currentWorkflow.value,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // Load from localStorage
  function loadFromLocalStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        nodes.value = data.nodes || [];
        edges.value = data.edges || [];
        currentWorkflow.value = data.currentWorkflow || null;
        return true;
      } catch (err) {
        console.error('Failed to load from localStorage:', err);
        return false;
      }
    }
    return false;
  }

  // Auto-save when data changes
  watch(
    [nodes, edges],
    () => {
      saveToLocalStorage();
    },
    { deep: true }
  );

  // Initialize by loading from localStorage
  loadFromLocalStorage();

  async function loadWorkflows() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.listWorkflows();
      workflows.value = response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load workflows';
    } finally {
      loading.value = false;
    }
  }

  async function loadWorkflow(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const workflow = await api.getWorkflow(id);
      currentWorkflow.value = workflow;

      // Convert workflow nodes to Vue Flow nodes
      nodes.value = workflow.nodes.map((node: WorkflowNode) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      }));

      edges.value = workflow.edges || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load workflow';
    } finally {
      loading.value = false;
    }
  }

  async function saveWorkflow() {
    if (!currentWorkflow.value) return;

    loading.value = true;
    error.value = null;
    try {
      const workflowData: Partial<WorkflowData> = {
        name: currentWorkflow.value.name,
        description: currentWorkflow.value.description,
        nodes: nodes.value.map((node) => ({
          id: node.id,
          type: node.type || 'custom',
          position: node.position,
          data: node.data,
        })),
        edges: edges.value.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle || undefined,
          targetHandle: edge.targetHandle || undefined,
        })),
      };

      await api.updateWorkflow(currentWorkflow.value.id, workflowData);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save workflow';
    } finally {
      loading.value = false;
    }
  }

  async function createWorkflow(name: string, description?: string) {
    loading.value = true;
    error.value = null;
    try {
      const workflow = await api.createWorkflow({
        name,
        description,
        nodes: [],
        edges: [],
      });
      currentWorkflow.value = workflow;
      nodes.value = [];
      edges.value = [];
      await loadWorkflows();
      return workflow;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create workflow';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteWorkflow(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await api.deleteWorkflow(id);
      if (currentWorkflow.value?.id === id) {
        currentWorkflow.value = null;
        nodes.value = [];
        edges.value = [];
      }
      await loadWorkflows();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete workflow';
    } finally {
      loading.value = false;
    }
  }

  function addNode(node: Node) {
    nodes.value = [...nodes.value, node];
  }

  function updateNode(id: string, data: Partial<Node>) {
    nodes.value = nodes.value.map((node) => (node.id === id ? { ...node, ...data } : node));
  }

  function deleteNode(id: string) {
    nodes.value = nodes.value.filter((node) => node.id !== id);
    edges.value = edges.value.filter((edge) => edge.source !== id && edge.target !== id);
  }

  function removeNodes(nodeIds: string[]) {
    nodes.value = nodes.value.filter((node) => !nodeIds.includes(node.id));
    edges.value = edges.value.filter(
      (edge) => !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
    );
  }

  function onConnect(connection: Connection) {
    if (!connection.source || !connection.target) return;

    const newEdge: Edge = {
      id: `e${connection.source}-${connection.target}`,
      type: 'custom',
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle || undefined,
      targetHandle: connection.targetHandle || undefined,
    };

    edges.value = [...edges.value, newEdge];
  }

  function deleteEdge(id: string) {
    edges.value = edges.value.filter((edge) => edge.id !== id);
  }

  function removeEdges(edgeIds: string[]) {
    edges.value = edges.value.filter((edge) => !edgeIds.includes(edge.id));
  }

  function selectNode(node: Node | null) {
    selectedNode.value = node;
  }

  function exportWorkflow() {
    if (!currentWorkflow.value) return null;

    return {
      ...currentWorkflow.value,
      nodes: nodes.value,
      edges: edges.value,
      exportedAt: new Date().toISOString(),
    };
  }

  return {
    // State
    nodes,
    edges,
    currentWorkflow,
    workflows,
    loading,
    error,
    selectedNode,

    // Computed
    nodeCount,
    edgeCount,

    // Actions
    loadWorkflows,
    loadWorkflow,
    saveWorkflow,
    createWorkflow,
    deleteWorkflow,
    addNode,
    updateNode,
    deleteNode,
    removeNodes,
    onConnect,
    deleteEdge,
    removeEdges,
    selectNode,
    exportWorkflow,

    // LocalStorage
    saveToLocalStorage,
    loadFromLocalStorage,
  };
});
