<template>
  <div ref="editorContainer" class="monaco-editor-container" />
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { ref, onMounted, onUnmounted, watch } from 'vue';

import { MONACO_CONFIG } from '../utils/constants';

// Configure Monaco Editor Web Workers

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

const props = defineProps<{
  value: string;
  language?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}>();

const emit = defineEmits<{
  'update:value': [value: string];
}>();

const editorContainer = ref<HTMLElement>();
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

onMounted(() => {
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: props.value,
      language: props.language || MONACO_CONFIG.DEFAULT_LANGUAGE,
      theme: MONACO_CONFIG.THEME,
      automaticLayout: MONACO_CONFIG.AUTOMATIC_LAYOUT,
      ...props.options,
    });

    editor.onDidChangeModelContent(() => {
      if (editor) {
        emit('update:value', editor.getValue());
      }
    });
  }
});

watch(
  () => props.value,
  (newValue) => {
    if (editor && editor.getValue() !== newValue) {
      editor.setValue(newValue);
    }
  }
);

onUnmounted(() => {
  editor?.dispose();
});
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
}
</style>
