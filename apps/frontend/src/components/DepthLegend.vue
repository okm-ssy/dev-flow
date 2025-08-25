<template>
  <div
    class="depth-legend fixed bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 transition-all duration-200"
    :class="[expanded ? 'p-3' : 'p-2', position]"
  >
    <div class="flex items-center justify-between">
      <h4 v-if="expanded" class="text-sm font-semibold text-gray-200 mb-2">Edge Depth Colors</h4>
      <button
        @click="expanded = !expanded"
        class="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
        :class="{ 'ml-2': expanded }"
      >
        <svg v-if="expanded" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 21l3-3 3 3 7-7v3m-4 0a4 4 0 01-8 0V7a4 4 0 018 0v4z"
          ></path>
        </svg>
      </button>
    </div>

    <div v-if="expanded" class="space-y-1">
      <div v-for="(color, index) in depthColors" :key="index" class="flex items-center space-x-2">
        <div class="w-4 h-0.5 rounded" :style="{ backgroundColor: color }" />
        <span class="text-xs text-gray-300">
          Depth {{ index }}{{ index === depthColors.length - 1 ? '+' : '' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  nodeEditorOpen?: boolean;
}>();

const expanded = ref(false);

const depthColors = [
  '#ef4444', // red-500 - depth 0
  '#f97316', // orange-500 - depth 1
  '#eab308', // yellow-500 - depth 2
  '#22c55e', // green-500 - depth 3
  '#3b82f6', // blue-500 - depth 4
  '#6366f1', // indigo-500 - depth 5
  '#8b5cf6', // violet-500 - depth 6
  '#ec4899', // pink-500 - depth 7+
];

// Position logic: avoid conflicts with other panels
const position = computed(() => {
  if (props.nodeEditorOpen) {
    return 'bottom-4 right-4'; // Bottom right if node editor is open
  } else {
    return 'top-4 right-4'; // Top right if node editor is closed
  }
});
</script>
