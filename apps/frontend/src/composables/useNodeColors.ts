// 共通のノードカラー定義
export const pastelColors: Record<string, string> = {
  input: '#D1FAE5', // pastel green
  process: '#DBEAFE', // pastel blue (changed from gray)
  condition: '#FEF3C7', // pastel yellow
  database: '#EDE9FE', // pastel purple
  api: '#E0E7FF', // pastel indigo
  script: '#FED7AA', // pastel orange
  other: '#FCE7F3', // pastel pink
};

// アイコンの色（もう少し濃いバージョン）
export const iconColors: Record<string, string> = {
  input: '#10B981', // emerald-500
  process: '#3B82F6', // blue-500 (changed from gray)
  condition: '#F59E0B', // amber-500
  database: '#8B5CF6', // violet-500
  api: '#6366F1', // indigo-500
  script: '#F97316', // orange-500
  other: '#EC4899', // pink-500
};

// ボーダー用の濃い色（さらに濃いバージョン）
export const borderColors: Record<string, string> = {
  input: '#059669', // emerald-600
  process: '#2563EB', // blue-600 (changed from gray)
  condition: '#D97706', // amber-600
  database: '#7C3AED', // violet-600
  api: '#4F46E5', // indigo-600
  script: '#EA580C', // orange-600
  other: '#DB2777', // pink-600
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
