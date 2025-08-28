import type { Node, Edge, Connection } from '@vue-flow/core';
import { defineStore } from 'pinia';
import { ref, computed, watch, readonly } from 'vue';

import { api } from '../services/api';
import type { Workflow, WorkflowNode, WorkflowData } from '../types';
import { UI_MESSAGES } from '../utils/constants';

export const useWorkflowStore = defineStore('workflow', () => {
  const nodes = ref<Node[]>([]);
  const edges = ref<Edge[]>([]);
  const currentWorkflow = ref<Workflow | null>(null);
  const workflows = ref<Workflow[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedNode = ref<Node | null>(null);
  const currentProjectId = ref<string>('default');
  const autoSaveEnabled = ref(true);

  const nodeCount = computed(() => nodes.value.length);
  const edgeCount = computed(() => edges.value.length);

  // Save project data to local file system via API
  async function saveProject(projectId?: string): Promise<boolean> {
    const id = projectId || currentProjectId.value;
    const data = {
      projectId: id,
      nodes: nodes.value,
      edges: edges.value,
      currentWorkflow: currentWorkflow.value,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: id, data }),
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }
      return true;
    } catch (err) {
      console.error('Failed to save project:', err);
      // Fallback to localStorage
      localStorage.setItem(`dev-flow-project-${id}`, JSON.stringify(data));
      return false; // API save failed, using localStorage fallback
    }
  }

  // Load project data from local file system via API
  async function loadProject(projectId?: string) {
    const id = projectId || currentProjectId.value;

    try {
      const response = await fetch(`/api/projects/${id}`);

      if (response.ok) {
        const result = await response.json();
        // APIレスポンスは { success: true, data: { data: {...} } } の形式
        // project-storageが { data: {...} } を返すため
        const projectData = result.data?.data || result.data || result;
        nodes.value = projectData.nodes || [];
        edges.value = projectData.edges || [];
        currentWorkflow.value = projectData.currentWorkflow || null;
        currentProjectId.value = id;
        return true;
      } else if (response.status === 404 && id !== 'default') {
        // Project doesn't exist, try default project
        console.warn(`Project ${id} not found, falling back to default`);
        currentProjectId.value = 'default';
        localStorage.setItem('dev-flow-current-project', 'default');
        return await loadProject('default');
      }
    } catch (err) {
      console.error('Failed to load project from API:', err);
    }

    // Fallback to localStorage
    const saved = localStorage.getItem(`dev-flow-project-${id}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        nodes.value = data.nodes || [];
        edges.value = data.edges || [];
        currentWorkflow.value = data.currentWorkflow || null;
        currentProjectId.value = id;
        return true;
      } catch (err) {
        console.error('Failed to load from localStorage:', err);
      }
    }

    // If we still can't load anything and it's not the default project, try default
    if (id !== 'default') {
      console.warn(`Failed to load project ${id}, trying default project`);
      currentProjectId.value = 'default';
      localStorage.setItem('dev-flow-current-project', 'default');
      return await loadProject('default');
    }

    return false;
  }

  // Get list of available projects
  async function getProjects() {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const result = await response.json();
        // Check if the response is wrapped in a success/data structure
        if (result && result.data && Array.isArray(result.data)) {
          return result.data;
        }
        // If it's directly an array
        if (Array.isArray(result)) {
          return result;
        }
        // If neither, log for debugging and return empty array
        console.warn('Unexpected API response format:', result);
        return [];
      }
    } catch (err) {
      console.error('Failed to get projects:', err);
    }

    // Fallback: get from localStorage
    const projects = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('dev-flow-project-')) {
        const projectId = key.replace('dev-flow-project-', '');
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          projects.push({
            id: projectId,
            nodeCount: data.nodes?.length || 0,
            edgeCount: data.edges?.length || 0,
            lastModified: data.timestamp,
          });
        } catch (err) {
          console.error('Failed to parse project data:', err);
        }
      }
    }
    return projects;
  }

  // Set current project ID
  function setCurrentProjectId(projectId: string) {
    currentProjectId.value = projectId;
  }

  // Auto-save when data changes (only when enabled)
  // Use debounce to avoid excessive saves
  let saveTimeout: NodeJS.Timeout | null = null;
  let isInitialLoad = true;

  watch(
    [nodes, edges],
    () => {
      // Skip the initial load to prevent overwriting data
      if (isInitialLoad) {
        return;
      }

      if (autoSaveEnabled.value) {
        // Clear existing timeout
        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }

        // Set new timeout for debounced save
        saveTimeout = setTimeout(() => {
          saveProject();
        }, 1000); // Save after 1 second of inactivity
      }
    },
    {
      deep: true,
      // Ignore certain properties that shouldn't trigger saves
      // Filter out selection, hover, and other transient states
      flush: 'post',
    }
  );

  // Initialize by loading the last used project or default
  const savedProjectId = localStorage.getItem('dev-flow-current-project');
  if (savedProjectId) {
    currentProjectId.value = savedProjectId;
  }

  // Load project with error handling for startup
  loadProject()
    .then(() => {
      // Enable auto-save after initial load is complete
      setTimeout(() => {
        isInitialLoad = false;
      }, 100);
    })
    .catch((err) => {
      console.warn('Failed to load project on startup, resetting to default:', err);
      currentProjectId.value = 'default';
      localStorage.setItem('dev-flow-current-project', 'default');
      loadProject('default').then(() => {
        setTimeout(() => {
          isInitialLoad = false;
        }, 100);
      });
    });

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
    // 即座に保存（ノード詳細変更時）
    saveProject();
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

  function importProjectData(data: {
    nodes: Node[];
    edges: Edge[];
    currentWorkflow?: Workflow | null;
    projectId?: string;
  }) {
    try {
      // Validate structure
      if (!data.nodes || !Array.isArray(data.nodes)) {
        throw new Error(UI_MESSAGES.JSON_NODES_MISSING);
      }
      if (!data.edges || !Array.isArray(data.edges)) {
        throw new Error(UI_MESSAGES.JSON_EDGES_MISSING);
      }

      // Temporarily disable auto-save during import to prevent race condition
      autoSaveEnabled.value = false;

      const originalNodes = nodes.value;
      const originalEdges = edges.value;
      const originalWorkflow = currentWorkflow.value;

      try {
        // Import new data directly without clearing first
        nodes.value = [...data.nodes];
        edges.value = [...data.edges];
        currentWorkflow.value = data.currentWorkflow || null;

        // Update project ID if provided
        if (data.projectId) {
          currentProjectId.value = data.projectId;
          localStorage.setItem('dev-flow-current-project', data.projectId);
        }

        // Re-enable auto-save
        autoSaveEnabled.value = true;

        return true;
      } catch (importErr) {
        // Rollback on error
        nodes.value = originalNodes;
        edges.value = originalEdges;
        currentWorkflow.value = originalWorkflow;
        autoSaveEnabled.value = true;
        throw importErr;
      }
    } catch (err) {
      console.error('Failed to import project data:', err);
      autoSaveEnabled.value = true;
      throw err;
    }
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
    importProjectData,

    // Project Management
    saveProject,
    loadProject,
    getProjects,
    setCurrentProjectId,
    currentProjectId: readonly(currentProjectId),
  };
});
