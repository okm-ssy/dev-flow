<template>
  <div
    class="node-editor absolute right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-20"
  >
    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
      <h3 class="font-semibold text-gray-800">Node Properties</h3>
      <button @click="$emit('close')" class="p-1 hover:bg-gray-100 rounded">
        <X class="w-4 h-4" />
      </button>
    </div>

    <div class="p-4 space-y-4">
      <!-- Node Label -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Label </label>
        <input
          v-model="localNode.data.label"
          @input="updateNode"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Node Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Type </label>
        <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
          {{ node.data.type }}
        </div>
      </div>

      <!-- Node Configuration -->
      <div v-if="node.data.config">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Configuration</h4>
        <div class="space-y-3">
          <div v-for="(value, key) in node.data.config" :key="key">
            <label class="block text-xs font-medium text-gray-600 mb-1">
              {{ formatLabel(key.toString()) }}
            </label>
            <input
              v-if="typeof value === 'string' || typeof value === 'number'"
              :value="value"
              @input="updateConfig(key.toString(), ($event.target as HTMLInputElement).value)"
              type="text"
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <textarea
              v-else-if="typeof value === 'object'"
              :value="JSON.stringify(value, null, 2)"
              @input="updateConfig(key.toString(), ($event.target as HTMLTextAreaElement).value)"
              rows="3"
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>
      </div>

      <!-- Monaco Editor for code nodes -->
      <div v-if="node.data.type === 'script' || node.data.type === 'transform'">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Code</h4>
        <MonacoEditor
          :value="node.data.config?.code || ''"
          @update:value="updateConfig('code', $event)"
          :options="{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }"
          language="javascript"
          class="h-64 border border-gray-300 rounded"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '@vue-flow/core';
import { X } from 'lucide-vue-next';
import { ref, watch } from 'vue';

import MonacoEditor from './MonacoEditor.vue';

const props = defineProps<{
  node: Node;
}>();

const emit = defineEmits<{
  update: [nodeId: string, data: unknown];
  close: [];
}>();

const localNode = ref({ ...props.node });

watch(
  () => props.node,
  (newNode) => {
    localNode.value = { ...newNode };
  },
  { deep: true }
);

function updateNode() {
  emit('update', props.node.id, localNode.value.data);
}

function updateConfig(key: string, value: unknown) {
  const config = { ...localNode.value.data.config };

  // Try to parse JSON for object values
  if (typeof value === 'string' && value.startsWith('{')) {
    try {
      config[key] = JSON.parse(value);
    } catch {
      config[key] = value;
    }
  } else {
    config[key] = value;
  }

  localNode.value.data.config = config;
  updateNode();
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
</script>
