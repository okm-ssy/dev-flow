<template>
  <div ref="editorContainer" class="monaco-editor-container" />
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor';
import { ref, onMounted, onUnmounted, watch } from 'vue';

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
      language: props.language || 'javascript',
      theme: 'vs',
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
