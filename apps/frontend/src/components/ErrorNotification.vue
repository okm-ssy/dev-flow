<template>
  <div
    class="fixed bottom-4 right-4 max-w-md bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 z-50"
  >
    <div class="flex items-start">
      <AlertCircle class="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
      <div class="flex-1">
        <h3 class="text-sm font-semibold text-red-800 mb-1">Error</h3>
        <p class="text-sm text-red-600">{{ message }}</p>
      </div>
      <button @click="$emit('close')" class="ml-3 p-1 hover:bg-red-100 rounded">
        <X class="w-4 h-4 text-red-600" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, X } from 'lucide-vue-next';

defineProps<{
  message: string;
}>();

defineEmits<{
  close: [];
}>();
</script>
