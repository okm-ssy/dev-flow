<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @mousedown.self="closeSettings"
  >
    <div
      class="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4"
      @mousedown.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-600 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-100">プロジェクト設定</h2>
        <button @click="closeSettings" class="p-2 hover:bg-gray-700 rounded-full transition-colors">
          <X class="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Project Management -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-200">プロジェクト管理</h3>

          <!-- Current Project -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">現在のプロジェクト</label>
            <div class="flex items-center space-x-3">
              <input
                v-model="currentProjectId"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="project-id"
              />
              <button
                @click="switchProject"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                切替
              </button>
            </div>
          </div>

          <!-- Create New Project -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">新しいプロジェクト</label>
            <div class="flex items-center space-x-3">
              <input
                v-model="newProjectId"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="new-project-id"
              />
              <button
                @click="createProject"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                作成
              </button>
            </div>
          </div>

          <!-- Project List -->
          <div v-if="projectList.length > 0">
            <label class="block text-sm font-medium text-gray-300 mb-2">既存プロジェクト</label>
            <div class="space-y-2">
              <div
                v-for="project in projectList"
                :key="project.id"
                class="flex items-center justify-between p-3 bg-gray-700 rounded-md"
              >
                <div class="flex items-center space-x-3">
                  <span class="text-gray-200 font-medium">{{ project.id }}</span>
                  <span class="text-gray-400 text-sm">
                    {{ project.nodeCount }} nodes, {{ project.edgeCount }} edges
                  </span>
                  <span class="text-gray-500 text-xs">{{ project.lastModified }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="switchToProject(project.id)"
                    class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    開く
                  </button>
                  <button
                    @click="deleteProject(project.id)"
                    class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- JSON Import/Export -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-200">JSON インポート/エクスポート</h3>

          <!-- Export -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-300"
                >エクスポート (現在のワークフロー)</label
              >
              <button
                @click="copyToClipboard"
                class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500 transition-colors"
              >
                コピー
              </button>
            </div>
            <textarea
              v-model="exportJson"
              readonly
              class="w-full h-32 px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none resize-none font-mono text-sm"
              placeholder="エクスポートされたJSONがここに表示されます"
            />
          </div>

          <!-- Import -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-300">インポート</label>
              <button
                @click="importFromJson"
                class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                :disabled="!importJson.trim()"
              >
                インポート
              </button>
            </div>
            <textarea
              v-model="importJson"
              class="w-full h-32 px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
              placeholder="インポートするJSONを貼り付けてください"
            />
            <div v-if="importError" class="mt-2 text-red-400 text-sm">
              {{ importError }}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-600 flex justify-end">
        <button
          @click="closeSettings"
          class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          閉じる
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { ref, computed, watch, onMounted } from 'vue';

import { useWorkflowStore } from '../stores/workflow';

const _props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const workflowStore = useWorkflowStore();

const currentProjectId = ref('default');
const newProjectId = ref('');
const importJson = ref('');
const importError = ref('');

// Export JSON (current workflow state)
const exportJson = computed(() => {
  const data = {
    projectId: currentProjectId.value,
    nodes: workflowStore.nodes,
    edges: workflowStore.edges,
    currentWorkflow: workflowStore.currentWorkflow,
    timestamp: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
});

// Project list from API
const projectList = ref([]);

async function loadProjects() {
  try {
    const projects = await workflowStore.getProjects();
    projectList.value = projects.map((p) => ({
      ...p,
      lastModified: new Date(p.lastModified).toLocaleString(),
    }));
  } catch (err) {
    console.error('Failed to load projects:', err);
  }
}

function closeSettings() {
  emit('close');
}

function switchProject() {
  if (!currentProjectId.value.trim()) {
    alert('プロジェクトIDを入力してください');
    return;
  }

  // Save current project ID to localStorage
  localStorage.setItem('dev-flow-current-project', currentProjectId.value.trim());

  // Load new project
  workflowStore.loadProject(currentProjectId.value.trim());
}

function createProject() {
  if (!newProjectId.value.trim()) {
    alert('プロジェクトIDを入力してください');
    return;
  }

  // Clear current workflow
  workflowStore.nodes = [];
  workflowStore.edges = [];
  workflowStore.currentWorkflow = null;

  currentProjectId.value = newProjectId.value.trim();
  newProjectId.value = '';

  // Save current project ID to localStorage
  localStorage.setItem('dev-flow-current-project', currentProjectId.value);

  // Save empty project
  workflowStore.saveProject();
}

function switchToProject(projectId: string) {
  currentProjectId.value = projectId;
  switchProject();
}

async function deleteProject(projectId: string) {
  if (confirm(`プロジェクト "${projectId}" を削除しますか？`)) {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('プロジェクトの削除に失敗しました');
    }
  }
}

function copyToClipboard() {
  navigator.clipboard.writeText(exportJson.value).then(() => {
    alert('クリップボードにコピーしました');
  });
}

function importFromJson() {
  importError.value = '';

  if (!importJson.value.trim()) {
    importError.value = 'JSONを入力してください';
    return;
  }

  try {
    const data = JSON.parse(importJson.value);

    // Validate structure
    if (!data.nodes || !Array.isArray(data.nodes)) {
      throw new Error('無効なJSON形式: nodesが見つかりません');
    }
    if (!data.edges || !Array.isArray(data.edges)) {
      throw new Error('無効なJSON形式: edgesが見つかりません');
    }

    // Import data
    workflowStore.nodes = data.nodes;
    workflowStore.edges = data.edges;
    workflowStore.currentWorkflow = data.currentWorkflow || null;

    if (data.projectId) {
      currentProjectId.value = data.projectId;
    }

    // Save imported data
    workflowStore.saveProject();

    importJson.value = '';
    alert('JSONを正常にインポートしました');
  } catch (err) {
    importError.value = err instanceof Error ? err.message : '無効なJSON形式です';
  }
}

// Watch for project ID changes
watch(currentProjectId, (newId) => {
  workflowStore.setCurrentProjectId(newId);
});

// Initialize current project ID from localStorage or default
onMounted(() => {
  const savedProjectId = localStorage.getItem('dev-flow-current-project');
  currentProjectId.value = savedProjectId || workflowStore.currentProjectId || 'default';
  loadProjects();
});
</script>
