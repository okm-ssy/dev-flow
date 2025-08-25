<template>
  <div class="node-palette p-4 border-b border-gray-700 bg-gray-900">
    <div class="text-sm font-semibold text-white mb-3">Node Palette</div>
    <div class="space-y-2">
      <button
        v-for="(template, type) in nodeTemplates"
        :key="type"
        @click="$emit('add-node', type)"
        class="w-full px-3 py-2 text-left text-sm bg-gray-700 rounded hover:bg-gray-600 transition-colors flex items-center space-x-2 border-2"
        :style="{ borderColor: getBorderColor(type) }"
      >
        <component
          :is="getIcon(template.icon)"
          class="w-4 h-4"
          :style="{ color: getIconColor(type) }"
        />
        <span class="text-white">{{ template.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Code, GitBranch, Database, Globe, Terminal, Package } from 'lucide-vue-next';

import { getBorderColor, getIconColor } from '../composables/useNodeColors';
import { nodeTemplates } from '../utils/nodeTemplates';

defineEmits<{
  'add-node': [type: string];
}>();

const iconMap: Record<string, typeof FileText> = {
  FileText,
  Code,
  GitBranch,
  Database,
  Globe,
  Terminal,
  Package,
};

function getIcon(iconName: string) {
  return iconMap[iconName] || FileText;
}
</script>
