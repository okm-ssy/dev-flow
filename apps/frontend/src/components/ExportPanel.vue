<template>
  <div class="export-panel p-4 bg-gray-900">
    <h3 class="text-sm font-semibold text-gray-200 mb-3">Export Options</h3>

    <div class="space-y-3">
      <button
        @click="exportAsJSON"
        class="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        <Download class="inline w-4 h-4 mr-2" />
        Export as JSON
      </button>

      <button
        @click="exportToAPI"
        class="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        <Send class="inline w-4 h-4 mr-2" />
        Save to API
      </button>

      <button
        @click="showApiPanel = !showApiPanel"
        class="w-full px-3 py-2 text-sm bg-gray-600 text-gray-200 rounded hover:bg-gray-500 transition-colors"
      >
        <Code class="inline w-4 h-4 mr-2" />
        API Integration
      </button>
    </div>

    <!-- API Panel -->
    <div v-if="showApiPanel" class="mt-4 p-3 bg-gray-700 rounded-lg">
      <h4 class="text-xs font-semibold text-gray-300 mb-2">API Endpoints</h4>
      <div class="space-y-1 text-xs font-mono">
        <div class="p-2 bg-gray-600 text-gray-200 rounded border border-gray-500">
          GET /api/workflows
        </div>
        <div class="p-2 bg-gray-600 text-gray-200 rounded border border-gray-500">
          POST /api/workflows
        </div>
        <div class="p-2 bg-gray-600 text-gray-200 rounded border border-gray-500">
          PUT /api/workflows/:id
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node, Edge } from '@vue-flow/core';
import { Download, Send, Code } from 'lucide-vue-next';
import { ref } from 'vue';

import { useWorkflowStore } from '../stores/workflow';
import type { Workflow } from '../types';

const props = defineProps<{
  workflow: Workflow;
  nodes: Node[];
  edges: Edge[];
}>();

const workflowStore = useWorkflowStore();
const showApiPanel = ref(false);

function exportAsJSON() {
  const data = {
    ...props.workflow,
    nodes: props.nodes,
    edges: props.edges,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${props.workflow.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportToAPI() {
  await workflowStore.saveWorkflow();
}
</script>
