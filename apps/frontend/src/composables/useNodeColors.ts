// 共通のノードカラー定義
export const pastelColors: Record<string, string> = {
  input: '#D1FAE5', // pastel green
  process: '#F3F4F6', // pastel gray
  condition: '#FEF3C7', // pastel yellow
  database: '#EDE9FE', // pastel purple
  api: '#E0E7FF', // pastel indigo
  script: '#FED7AA', // pastel orange
};

// アイコンの色（もう少し濃いバージョン）
export const iconColors: Record<string, string> = {
  input: '#10B981', // emerald-500
  process: '#6B7280', // gray-500
  condition: '#F59E0B', // amber-500
  database: '#8B5CF6', // violet-500
  api: '#6366F1', // indigo-500
  script: '#F97316', // orange-500
};

// ボーダー用の濃い色（さらに濃いバージョン）
export const borderColors: Record<string, string> = {
  input: '#059669', // emerald-600
  process: '#4B5563', // gray-600
  condition: '#D97706', // amber-600
  database: '#7C3AED', // violet-600
  api: '#4F46E5', // indigo-600
  script: '#EA580C', // orange-600
};

export function getNodeColor(type: string): string {
  return pastelColors[type] || pastelColors.process;
}

export function getIconColor(type: string): string {
  return iconColors[type] || iconColors.process;
}

export function getBorderColor(type: string): string {
  return borderColors[type] || borderColors.process;
}
