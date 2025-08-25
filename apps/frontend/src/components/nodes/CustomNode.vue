<template>
  <div
    class="custom-node bg-white border-2 rounded-lg shadow-md p-3 min-w-[150px] opacity-100"
    :class="nodeClass"
    :style="nodeStyle"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-2">
        <component
          :is="getIcon(data.type)"
          class="w-4 h-4"
          :style="{ color: getIconColor(data.type) }"
        />
        <span class="font-medium text-sm">{{ data.label }}</span>
      </div>
    </div>

    <!-- Handles -->
    <Handle
      v-for="input in data.inputs"
      :key="`input-${input.id}`"
      type="target"
      :id="input.id"
      :position="Position.Left"
      :style="{ top: `${30 + data.inputs.indexOf(input) * 25}px` }"
      class="w-3 h-3"
    />

    <Handle
      v-for="output in data.outputs"
      :key="`output-${output.id}`"
      type="source"
      :id="output.id"
      :position="Position.Right"
      :style="{ top: `${30 + data.outputs.indexOf(output) * 25}px` }"
      class="w-3 h-3"
    />

    <!-- Node Content -->
    <div v-if="data.config" class="text-xs text-gray-600 mt-2">
      <div v-for="(value, key) in data.config" :key="key">
        <span class="font-medium">{{ key }}:</span> {{ value }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { FileText, Code, GitBranch, Database, Globe, Terminal, Package } from 'lucide-vue-next';
import { computed } from 'vue';

import { getNodeColor, getIconColor } from '../../composables/useNodeColors';

const props = defineProps<{
  data: {
    label: string;
    type: string;
    config?: Record<string, unknown>;
    inputs?: Array<{ id: string; label: string }>;
    outputs?: Array<{ id: string; label: string }>;
  };
  id: string;
}>();

const _emit = defineEmits<{
  update: [id: string, data: unknown];
}>();

const iconMap: Record<string, typeof FileText> = {
  input: FileText,
  process: Code,
  condition: GitBranch,
  database: Database,
  api: Globe,
  script: Terminal,
  other: Package,
};

function getIcon(type: string) {
  return iconMap[type] || FileText;
}

const nodeClass = computed(() => {
  // 枠線は削除（styleで直接指定）
  return '';
});

const nodeStyle = computed(() => {
  const color = getNodeColor(props.data.type);
  return {
    borderColor: color,
    borderWidth: '3px',
    borderStyle: 'solid',
    backgroundColor: '#ffffff',
    opacity: '1',
  };
});
</script>
