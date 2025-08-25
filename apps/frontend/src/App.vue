<template>
  <div id="app" class="h-screen flex flex-col bg-gray-900">
    <WorkflowEditor />
  </div>
</template>

<script setup lang="ts">
import WorkflowEditor from './components/WorkflowEditor.vue';
</script>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
@import '@vue-flow/minimap/dist/style.css';

/* Vue Flow Background Override */
.vue-flow__background {
  background-color: #1f2937 !important; /* gray-800 */
}

.vue-flow__pane {
  background-color: #1f2937 !important; /* gray-800 */
}

/* Custom edge styles */
.vue-flow__edge {
  transition: stroke-width 0.2s ease;
}

.vue-flow__edge:hover {
  stroke-width: 3px !important;
}

.vue-flow__edge.selected {
  stroke-width: 4px !important;
}

/* Custom node styles */
.custom-node {
  transition: all 0.2s ease;
  background-color: #ffffff !important;
  opacity: 1 !important;
}

.custom-node:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-width: 4px !important;
}

.custom-node.selected {
  transform: scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  border-width: 5px !important;
}

/* Handle styles */
.vue-flow__handle {
  width: 8px;
  height: 8px;
  border: 2px solid #fff;
  transition: all 0.2s ease;
}

.vue-flow__handle:hover {
  width: 12px;
  height: 12px;
  border-width: 3px;
}

.vue-flow__handle-connecting {
  background: #3b82f6;
  border-color: #1d4ed8;
}

/* MiniMap dark theme */
.vue-flow__minimap {
  background-color: #374151 !important; /* gray-700 */
  border: 1px solid #4b5563 !important; /* gray-600 */
}

.vue-flow__minimap-mask {
  fill: #1f2937 !important; /* gray-800 */
  fill-opacity: 0.8;
}

.vue-flow__minimap-node {
  fill: #6b7280 !important; /* gray-500 */
  stroke: #9ca3af !important; /* gray-400 */
}

/* Controls dark theme */
.vue-flow__controls {
  background-color: #374151 !important; /* gray-700 */
  border: 1px solid #4b5563 !important; /* gray-600 */
}

.vue-flow__controls-button {
  background-color: #4b5563 !important; /* gray-600 */
  border-color: #6b7280 !important; /* gray-500 */
  color: #e5e7eb !important; /* gray-200 */
}

.vue-flow__controls-button:hover {
  background-color: #6b7280 !important; /* gray-500 */
}

/* Edge animations */
:root {
  --animation-speed: 1s;
}

@keyframes dash {
  to {
    stroke-dashoffset: -10;
  }
}

.animated-edge {
  stroke-dasharray: 5, 5;
  animation: dash var(--animation-speed) linear infinite;
}

.edge-dot {
  opacity: 0.8;
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
}

/* Enhanced edge hover effects */
.vue-flow__edge:hover .animated-edge {
  stroke-width: 4px !important;
  stroke-dasharray: 8, 8;
  animation: dash calc(var(--animation-speed) * 0.5) linear infinite;
}

.vue-flow__edge:hover .edge-dot {
  r: 4;
  opacity: 1;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8));
}
</style>
