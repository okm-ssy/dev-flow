// UI Constants
export const UI_MESSAGES = {
  CONFIRM_DELETE_EDGE: 'このエッジを削除しますか？',
  CONFIRM_DELETE_PROJECT: 'プロジェクト "{0}" を削除しますか？',
  MONACO_EDITOR_THEME: 'vs',
  MONACO_EDITOR_LANGUAGE: 'javascript',
  JSON_IMPORT_SUCCESS: 'JSONを正常にインポートしました',
  JSON_INPUT_REQUIRED: 'JSONを入力してください',
  JSON_IMPORT_ERROR: '無効なJSON形式です',
  JSON_NODES_MISSING: '無効なJSON形式: nodesが見つかりません',
  JSON_EDGES_MISSING: '無効なJSON形式: edgesが見つかりません',
  CLIPBOARD_COPY_SUCCESS: 'クリップボードにコピーしました',
} as const;

// Project Configuration
export const PROJECT_CONFIG = {
  DEFAULT_PROJECT_ID: 'default',
  LOCALSTORAGE_PROJECT_KEY: 'dev-flow-current-project',
  LOCALSTORAGE_PROJECT_PREFIX: 'dev-flow-project-',
} as const;

// Monaco Editor Configuration
export const MONACO_CONFIG = {
  THEME: 'vs',
  DEFAULT_LANGUAGE: 'javascript',
  AUTOMATIC_LAYOUT: true,
} as const;
