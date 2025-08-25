<template>
  <div class="workflow-editor h-full flex">
    <!-- Sidebar -->
    <div class="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      <NodePalette @add-node="handleAddNode" />
      <ExportPanel
        v-if="currentWorkflow"
        :workflow="currentWorkflow"
        :nodes="nodes"
        :edges="edges"
      />
    </div>

    <!-- Main Editor -->
    <div class="flex-1 relative">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        @connect="onConnect"
        @node-click="handleNodeClick"
        @node-double-click="handleNodeDoubleClick"
        @pane-click="handlePaneClick"
        @nodes-delete="onNodesDelete"
        @edges-delete="onEdgesDelete"
        :connection-mode="ConnectionMode.Loose"
        :default-zoom="1"
        :min-zoom="0.5"
        :max-zoom="2"
        :delete-key-code="['Delete', 'Backspace']"
        class="bg-gray-900"
      >
        <template #node-custom="{ data, id }">
          <CustomNode :data="data" :id="id" @update="updateNodeData" />
        </template>

        <template #edge-custom="edgeProps">
          <CustomEdge
            v-bind="edgeProps"
            :depth="edgeDepths.get(edgeProps.id) || 0"
            :animated="animationEnabled"
          />
        </template>

        <!-- Arrow markers for directed edges -->
        <svg>
          <defs>
            <marker
              v-for="edge in edges"
              :key="`marker-${edge.id}`"
              :id="`arrow-${edge.id}`"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                :fill="getEdgeColor(edgeDepths.get(edge.id) || 0)"
              ></polygon>
            </marker>
          </defs>
        </svg>

        <Background pattern-color="#4a5568" :gap="16" variant="dots" />
        <MiniMap />
        <Controls />
      </VueFlow>

      <!-- Node Edit Dialog -->
      <NodeEditDialog
        :node="selectedNode"
        :is-open="!!selectedNode"
        @update="handleNodeUpdate"
        @close="selectedNode = null"
      />
    </div>

    <!-- Error Notification -->
    <ErrorNotification v-if="error" :message="error" @close="error = null" />

    <!-- Depth Legend -->
    <DepthLegend v-if="edges.length > 0" :node-editor-open="!!selectedNode" />

    <!-- Animation Controls -->
    <AnimationControls
      v-if="edges.length > 0"
      @toggle-animation="handleAnimationToggle"
      @speed-change="handleSpeedChange"
    />
  </div>
</template>

<script setup lang="ts">
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { VueFlow, ConnectionMode, useVueFlow, type Node, type Edge } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';

import { useEdgeDepth } from '../composables/useEdgeDepth';
import { useWorkflowStore } from '../stores/workflow';
import { nodeTemplates } from '../utils/nodeTemplates';

import AnimationControls from './AnimationControls.vue';
import CustomEdge from './CustomEdge.vue';
import DepthLegend from './DepthLegend.vue';
import ErrorNotification from './ErrorNotification.vue';
import ExportPanel from './ExportPanel.vue';
import NodeEditDialog from './NodeEditDialog.vue';
import NodePalette from './NodePalette.vue';
import CustomNode from './nodes/CustomNode.vue';

const workflowStore = useWorkflowStore();
const { nodes, edges, currentWorkflow, error, selectedNode } = storeToRefs(workflowStore);

const {
  onConnect,
  addNode,
  updateNode,
  selectNode,
  loadWorkflows,
  createWorkflow,
  removeNodes,
  removeEdges,
} = workflowStore;

const { project } = useVueFlow();
const { edgeDepths } = useEdgeDepth(nodes.value, edges.value);

// Animation controls
const animationEnabled = ref(true);
const animationSpeed = ref(1);

// Color function for edges
function getEdgeColor(depth: number) {
  const colors = [
    '#ef4444', // red-500 - depth 0
    '#f97316', // orange-500 - depth 1
    '#eab308', // yellow-500 - depth 2
    '#22c55e', // green-500 - depth 3
    '#3b82f6', // blue-500 - depth 4
    '#6366f1', // indigo-500 - depth 5
    '#8b5cf6', // violet-500 - depth 6
    '#ec4899', // pink-500 - depth 7+
  ];
  return colors[Math.min(depth, colors.length - 1)];
}

onMounted(async () => {
  await loadWorkflows();

  // Create a default workflow if none exists
  if (workflowStore.workflows.length === 0) {
    await createWorkflow('My First Workflow', 'A sample workflow to get started');
  } else if (workflowStore.workflows[0]?.id) {
    // Load the first workflow
    await workflowStore.loadWorkflow(workflowStore.workflows[0].id);
  }
});

function handleAddNode(type: string) {
  const template = nodeTemplates[type];
  if (!template) return;

  // Calculate position to avoid overlapping
  const baseX = 100;
  const baseY = 100;
  const offsetX = 200;
  const offsetY = 150;

  const existingNodes = nodes.value;
  const nodeCount = existingNodes.length;

  // Arrange nodes in a grid pattern
  const gridCols = 4;
  const col = nodeCount % gridCols;
  const row = Math.floor(nodeCount / gridCols);

  const position = project({
    x: baseX + col * offsetX,
    y: baseY + row * offsetY,
  });

  const newNode = {
    id: `${type}_${Date.now()}`,
    type: 'custom',
    position,
    data: {
      label: template.label,
      type,
      config: template.defaultConfig || {},
      inputs: template.inputs || [],
      outputs: template.outputs || [],
    },
  };

  addNode(newNode);
}

function handleNodeClick(event: { node: Node }) {
  selectNode(event.node);
}

function handleNodeDoubleClick(event: { node: Node }) {
  selectNode(event.node);
}

function handlePaneClick() {
  selectNode(null);
}

function handleNodeUpdate(nodeId: string, data: unknown) {
  updateNode(nodeId, { data });
}

function updateNodeData(nodeId: string, data: unknown) {
  const node = nodes.value.find((n) => n.id === nodeId);
  if (node) {
    updateNode(nodeId, {
      data: { ...node.data, ...data },
    });
  }
}

function handleAnimationToggle(enabled: boolean) {
  animationEnabled.value = enabled;
}

function handleSpeedChange(speed: number) {
  animationSpeed.value = speed;
  // Update CSS animation speed
  document.documentElement.style.setProperty('--animation-speed', `${1 / speed}s`);
}

function onNodesDelete(deletedNodes: Node[]) {
  const nodeIds = deletedNodes.map((node) => node.id);
  removeNodes(nodeIds);
}

function onEdgesDelete(deletedEdges: Edge[]) {
  const edgeIds = deletedEdges.map((edge) => edge.id);
  removeEdges(edgeIds);
}
</script>
