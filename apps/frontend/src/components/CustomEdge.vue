<template>
  <g>
    <path :id="id" :style="edgeStyle" class="vue-flow__edge-path animated-edge" :d="path" />
    <!-- Animated dots along the path -->
    <circle v-if="animated !== false" r="3" :fill="edgeColor" class="edge-dot">
      <animateMotion :dur="`${animationDuration}s`" repeatCount="indefinite" :path="path" />
    </circle>
  </g>
</template>

<script setup lang="ts">
import { getBezierPath } from '@vue-flow/core';
import type { EdgeProps } from '@vue-flow/core';
import { computed } from 'vue';

const props = defineProps<
  EdgeProps & {
    depth?: number;
    animated?: boolean;
  }
>();

// Calculate curved edge path
const path = computed(() => {
  const { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition } = props;
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return edgePath;
});

// Color based on depth
const getColorByDepth = (depth: number) => {
  const colors = [
    '#ec4899', // pink-500 - depth 0
    '#8b5cf6', // violet-500 - depth 1
    '#6366f1', // indigo-500 - depth 2
    '#3b82f6', // blue-500 - depth 3
    '#22c55e', // green-500 - depth 4
    '#eab308', // yellow-500 - depth 5
    '#f97316', // orange-500 - depth 6
    '#ef4444', // red-500 - depth 7+
  ];
  return colors[Math.min(depth, colors.length - 1)];
};

const edgeColor = computed(() => {
  const depth = props.depth || 0;
  return getColorByDepth(depth);
});

const edgeStyle = computed(() => ({
  stroke: edgeColor.value,
  strokeWidth: 3,
  fill: 'none',
  strokeDasharray: '5,5',
  animation: 'dash 1s linear infinite',
}));

// Fixed animation duration for consistent timing regardless of edge length
// This makes short edges animate slowly and long edges animate quickly
const animationDuration = computed(() => {
  return 3; // Fixed 3 seconds for all edges
});
</script>
