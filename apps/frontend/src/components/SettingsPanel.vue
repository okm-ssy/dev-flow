<template>
  <!-- Sidebar Settings Panel -->
  <div class="bg-gray-800 text-sm">
    <!-- Collapsible Header -->
    <button
      @click="isCollapsed = !isCollapsed"
      class="w-full flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 transition-colors"
    >
      <span
        class="transform transition-transform text-gray-400 mr-2"
        :class="{ 'rotate-90': !isCollapsed }"
      >
        ▶
      </span>
      <span class="text-xs font-medium text-gray-200">プロジェクト設定</span>
    </button>

    <!-- Collapsible Content -->
    <Collapse :when="isCollapsed">
      <div class="p-4">
        <!-- Project Selection -->
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-400 mb-1">プロジェクト</label>
          <select
            v-model="currentProjectId"
            @change="switchProject"
            class="w-full px-2 py-1 text-xs border border-gray-600 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option v-if="projectList.length === 0" :value="currentProjectId">
              {{ currentProjectId }}
            </option>
            <option v-for="project in projectList" :key="project.id" :value="project.id">
              {{ project.id }} ({{ project.nodeCount }}n {{ project.edgeCount }}e)
            </option>
          </select>
        </div>

        <!-- Create New Project Button -->
        <button
          @click="createNewProject"
          class="w-full mb-4 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          新しいプロジェクト
        </button>

        <!-- JSON Display/Import -->
        <div class="mb-2">
          <div class="flex items-center justify-between mb-1">
            <label class="text-xs font-medium text-gray-400">JSON</label>
            <div class="flex space-x-1">
              <button
                @click="importFromJson"
                class="px-2 py-0.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                :disabled="!displayedJson.trim()"
              >
                インポート
              </button>
              <button
                @click="copyJsonToClipboard"
                class="px-2 py-0.5 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
              >
                📋
              </button>
            </div>
          </div>
          <textarea
            v-model="displayedJson"
            class="w-full h-20 px-2 py-1 text-xs border border-gray-600 bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-mono"
            placeholder="JSON入出力"
            resize="vertical"
          />
          <div v-if="importError" class="mt-1 text-red-400 text-xs">
            {{ importError }}
          </div>
        </div>
      </div>
    </Collapse>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Collapse } from 'vue-collapsed';

import { useWorkflowStore } from '../stores/workflow';
import { UI_MESSAGES } from '../utils/constants';

// Sidebar-only component, no props needed

const workflowStore = useWorkflowStore();

const currentProjectId = ref('default');
const importError = ref('');
const isCollapsed = ref(false);

// Always display current JSON state
const displayedJson = computed({
  get: () => exportJson.value,
  set: (_value: string) => {
    // For sidebar, we allow direct editing
  },
});

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
    if (Array.isArray(projects)) {
      projectList.value = projects.map((p) => ({
        ...p,
        lastModified: new Date(p.lastModified).toLocaleString(),
      }));
    } else {
      console.warn('Projects response is not an array:', projects);
      projectList.value = [];
    }
  } catch (err) {
    console.error('Failed to load projects:', err);
    projectList.value = [];
  }
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

async function importFromJson() {
  importError.value = '';

  const jsonInput = displayedJson.value;
  if (!jsonInput.trim()) {
    importError.value = UI_MESSAGES.JSON_INPUT_REQUIRED;
    return;
  }

  try {
    const data = JSON.parse(jsonInput);

    // Use the new import function from workflow store
    workflowStore.importProjectData(data);

    // Update current project ID display
    if (data.projectId) {
      currentProjectId.value = data.projectId;
    }

    // Save imported data with a slight delay to ensure state is updated
    setTimeout(async () => {
      await workflowStore.saveProject();
    }, 100);

    alert(UI_MESSAGES.JSON_IMPORT_SUCCESS);

    // Refresh the projects list
    await loadProjects();
  } catch (err) {
    importError.value = err instanceof Error ? err.message : UI_MESSAGES.JSON_IMPORT_ERROR;
  }
}

function copyJsonToClipboard() {
  navigator.clipboard.writeText(displayedJson.value).then(() => {
    alert(UI_MESSAGES.CLIPBOARD_COPY_SUCCESS);
  });
}

async function createNewProject() {
  const projectId = prompt('新しいプロジェクトIDを入力してください:');
  if (!projectId || !projectId.trim()) {
    return;
  }

  // Clear current workflow
  workflowStore.nodes = [];
  workflowStore.edges = [];
  workflowStore.currentWorkflow = null;

  currentProjectId.value = projectId.trim();

  // Save current project ID to localStorage
  localStorage.setItem('dev-flow-current-project', currentProjectId.value);

  // Save empty project and wait for completion
  await workflowStore.saveProject(currentProjectId.value);

  // Update project list after saving is complete
  await loadProjects();
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
