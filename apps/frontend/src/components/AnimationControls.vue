<template>
  <div
    class="animation-controls fixed bottom-4 left-4 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-3 z-10"
  >
    <div class="flex items-center space-x-3">
      <span class="text-sm font-medium text-gray-300">Flow Animation</span>
      <button
        @click="toggleAnimation"
        class="p-2 rounded-md transition-colors"
        :class="[
          animated
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-600 hover:bg-gray-500 text-gray-300',
        ]"
      >
        <Play v-if="!animated" class="w-4 h-4" />
        <Pause v-else class="w-4 h-4" />
      </button>

      <!-- Speed control -->
      <div class="flex items-center space-x-2" v-if="animated">
        <span class="text-xs text-gray-400">Speed</span>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          v-model="speed"
          class="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <span class="text-xs text-gray-400 w-6">{{ speed }}x</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Play, Pause } from 'lucide-vue-next';
import { ref, watch } from 'vue';

const animated = ref(true);
const speed = ref(1);

const emit = defineEmits<{
  'toggle-animation': [animated: boolean];
  'speed-change': [speed: number];
}>();

function toggleAnimation() {
  animated.value = !animated.value;
  emit('toggle-animation', animated.value);
}

watch(speed, (newSpeed) => {
  emit('speed-change', newSpeed);
});
</script>

<style scoped>
/* Custom range slider styles */
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 12px;
  width: 12px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  height: 12px;
  width: 12px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
