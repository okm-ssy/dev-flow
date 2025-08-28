// 共通のノードカラー定義（少し暗くしたパステルカラー）
export const pastelColors: Record<string, string> = {
  input: '#A7F3D0', // darker pastel green
  process: '#F3F4F6', // light gray instead of pure white
  condition: '#FDE68A', // darker pastel yellow
  database: '#DDD6FE', // darker pastel purple
  api: '#C7D2FE', // darker pastel indigo
  script: '#FED7AA', // keep pastel orange as is
  other: '#FBCFE8', // darker pastel pink
};

// アイコンの色（もう少し濃いバージョン）
export const iconColors: Record<string, string> = {
  input: '#10B981', // emerald-500
  process: '#6B7280', // gray-500 (visible on white)
  condition: '#F59E0B', // amber-500
  database: '#8B5CF6', // violet-500
  api: '#6366F1', // indigo-500
  script: '#F97316', // orange-500
  other: '#EC4899', // pink-500
};

// ボーダー用の濃い色（より濃くしたバージョン）
export const borderColors: Record<string, string> = {
  input: '#047857', // emerald-700 (darker)
  process: '#6B7280', // gray-500 (darker)
  condition: '#B45309', // amber-700 (darker)
  database: '#6D28D9', // violet-700 (darker)
  api: '#4338CA', // indigo-700 (darker)
  script: '#C2410C', // orange-700 (darker)
  other: '#BE185D', // pink-700 (darker)
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
