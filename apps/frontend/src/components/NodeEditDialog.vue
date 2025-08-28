<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @mousedown.self="closeDialog"
  >
    <div
      class="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
      @mousedown.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-600 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div
            class="p-2 rounded-lg border-2"
            :style="{
              borderColor: getNodeColor(node?.data.type || ''),
              backgroundColor: '#ffffff',
            }"
          >
            <component :is="getIcon(node?.data.type || '')" class="w-6 h-6 text-gray-600" />
          </div>
          <h2 class="text-xl font-semibold text-gray-100">
            {{ node?.data.type || 'Node' }} - {{ node?.data.label || 'Untitled' }}
          </h2>
        </div>
        <button @click="closeDialog" class="p-2 hover:bg-gray-700 rounded-full transition-colors">
          <X class="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 py-4 space-y-6">
        <!-- タイトル -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"> タイトル </label>
          <input
            v-model="editData.label"
            type="text"
            class="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="タイトルを入力..."
          />
        </div>

        <!-- Node Configuration -->
        <div v-if="node?.data.config && Object.keys(node.data.config).length > 0">
          <h3 class="text-lg font-medium text-gray-200 mb-3">Configuration</h3>
          <div class="space-y-4">
            <div v-for="(value, key) in editData.config" :key="key">
              <!-- pathフィールドをスキップ (廃止) -->
              <template v-if="key !== 'path'">
                <label class="block text-sm font-medium text-gray-300 mb-1">
                  {{ formatLabel(key) }}
                </label>

                <!-- Code editor for script/transform nodes -->
                <div
                  v-if="
                    key === 'code' &&
                    (node?.data.type === 'script' || node?.data.type === 'transform')
                  "
                >
                  <MonacoEditor
                    v-model:value="editData.config[key]"
                    :options="{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      theme: 'vs-dark',
                    }"
                    language="javascript"
                    class="h-64 border border-gray-600 rounded-md"
                  />
                </div>

                <!-- Textarea for source field (準備内容) -->
                <textarea
                  v-else-if="key === 'source'"
                  v-model="editData.config[key]"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                  :placeholder="`${formatLabel(key)}を入力...`"
                />

                <!-- Regular input for other fields -->
                <input
                  v-else
                  v-model="editData.config[key]"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :placeholder="`${formatLabel(key)}を入力...`"
                />
              </template>
            </div>
          </div>
        </div>

        <!-- Node Connections Info -->
        <div class="grid grid-cols-2 gap-4">
          <div v-if="node?.data.inputs?.length">
            <h4 class="text-sm font-medium text-gray-300 mb-2">Inputs</h4>
            <div class="space-y-1">
              <div
                v-for="input in node.data.inputs"
                :key="input.id"
                class="text-xs px-2 py-1 bg-blue-900 text-blue-200 rounded"
              >
                {{ input.label }}
              </div>
            </div>
          </div>

          <div v-if="node?.data.outputs?.length">
            <h4 class="text-sm font-medium text-gray-300 mb-2">Outputs</h4>
            <div class="space-y-1">
              <div
                v-for="output in node.data.outputs"
                :key="output.id"
                class="text-xs px-2 py-1 bg-green-900 text-green-200 rounded"
              >
                {{ output.label }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-600 flex justify-end space-x-3">
        <button
          @click="closeDialog"
          class="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="saveChanges"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '@vue-flow/core';
import { X } from 'lucide-vue-next';
import { FileText, Code, GitBranch, Database, Globe, Terminal, Package } from 'lucide-vue-next';
import { ref, watch } from 'vue';

import MonacoEditor from './MonacoEditor.vue';

const props = defineProps<{
  node: Node | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  update: [nodeId: string, data: unknown];
}>();

const editData = ref({
  label: '',
  config: {} as Record<string, unknown>,
});

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

// パステルカラーの定義（CustomNode.vueと同じ）
const pastelColors: Record<string, string> = {
  input: '#D1FAE5', // pastel green
  process: '#F3F4F6', // pastel gray
  condition: '#FEF3C7', // pastel yellow
  database: '#EDE9FE', // pastel purple
  api: '#E0E7FF', // pastel indigo
  script: '#FED7AA', // pastel orange
  other: '#FCE7F3', // pastel pink (fallback)
};

function getNodeColor(type: string) {
  return pastelColors[type] || pastelColors.process;
}

function formatLabel(key: string): string {
  // 特定のキーに対する日本語ラベル
  const labelMap: Record<string, string> = {
    source: '準備内容',
    path: 'Path', // 廃止予定
    condition: '条件',
    language: '言語',
    code: 'コード',
    type: 'タイプ',
    query: 'クエリ',
    method: 'メソッド',
    url: 'URL',
    operation: '操作',
    description: '説明',
    notes: 'メモ',
  };

  return (
    labelMap[key] ||
    key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  );
}

function closeDialog() {
  emit('close');
}

function saveChanges() {
  if (!props.node) return;

  const updatedData = {
    ...props.node.data,
    label: editData.value.label,
    config: editData.value.config,
  };

  emit('update', props.node.id, updatedData);
  emit('close');
}

// Watch for node changes and update edit data
watch(
  () => props.node,
  (newNode) => {
    if (newNode) {
      editData.value = {
        label: newNode.data.label || '',
        config: { ...(newNode.data.config || {}) },
      };
    }
  },
  { deep: true, immediate: true }
);
</script>
