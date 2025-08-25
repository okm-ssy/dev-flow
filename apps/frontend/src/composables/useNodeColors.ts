// 共通のノードカラー定義
export const pastelColors: Record<string, string> = {
  input: '#D1FAE5', // pastel green
  output: '#DBEAFE', // pastel blue
  process: '#F3F4F6', // pastel gray
  condition: '#FEF3C7', // pastel yellow
  database: '#EDE9FE', // pastel purple
  api: '#E0E7FF', // pastel indigo
  script: '#FED7AA', // pastel orange
  transform: '#FCE7F3', // pastel pink
  trigger: '#FECACA', // pastel red
};

// アイコンの色（もう少し濃いバージョン）
export const iconColors: Record<string, string> = {
  input: '#10B981', // emerald-500
  output: '#3B82F6', // blue-500
  process: '#6B7280', // gray-500
  condition: '#F59E0B', // amber-500
  database: '#8B5CF6', // violet-500
  api: '#6366F1', // indigo-500
  script: '#F97316', // orange-500
  transform: '#EC4899', // pink-500
  trigger: '#EF4444', // red-500
};

export function getNodeColor(type: string): string {
  return pastelColors[type] || pastelColors.process;
}

export function getIconColor(type: string): string {
  return iconColors[type] || iconColors.process;
}
