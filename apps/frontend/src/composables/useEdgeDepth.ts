import type { Node, Edge } from '@vue-flow/core';
import { computed } from 'vue';

export function useEdgeDepth(nodes: Node[], edges: Edge[]) {
  // Calculate depth for each node from root nodes
  const calculateNodeDepths = () => {
    const nodeDepths = new Map<string, number>();
    const visited = new Set<string>();
    const visiting = new Set<string>();

    // Find root nodes (nodes with no incoming edges)
    const hasIncoming = new Set(edges.map((edge) => edge.target));
    const rootNodes = nodes.filter((node) => !hasIncoming.has(node.id));

    // DFS to calculate depths
    const dfs = (nodeId: string, currentDepth: number): number => {
      if (visiting.has(nodeId)) {
        // Cycle detected, return current depth
        return currentDepth;
      }

      if (visited.has(nodeId)) {
        return nodeDepths.get(nodeId) || 0;
      }

      visiting.add(nodeId);

      // Find all incoming edges to this node
      const incomingEdges = edges.filter((edge) => edge.target === nodeId);

      let maxParentDepth = -1;
      for (const edge of incomingEdges) {
        const parentDepth = dfs(edge.source, currentDepth + 1);
        maxParentDepth = Math.max(maxParentDepth, parentDepth);
      }

      const depth = maxParentDepth + 1;
      nodeDepths.set(nodeId, depth);
      visited.add(nodeId);
      visiting.delete(nodeId);

      return depth;
    };

    // Start from root nodes
    rootNodes.forEach((node) => {
      if (!visited.has(node.id)) {
        dfs(node.id, 0);
      }
    });

    // Handle orphaned nodes
    nodes.forEach((node) => {
      if (!nodeDepths.has(node.id)) {
        nodeDepths.set(node.id, 0);
      }
    });

    return nodeDepths;
  };

  const nodeDepths = computed(() => calculateNodeDepths());

  // Calculate depth for each edge based on source node depth
  const edgeDepths = computed(() => {
    const depths = new Map<string, number>();
    const nodeDepthMap = nodeDepths.value;

    edges.forEach((edge) => {
      const sourceDepth = nodeDepthMap.get(edge.source) || 0;
      depths.set(edge.id, sourceDepth);
    });

    return depths;
  });

  return {
    nodeDepths,
    edgeDepths,
  };
}
