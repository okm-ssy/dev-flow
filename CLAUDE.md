# Dev Flow - Visual Workflow Editor

Vue.js + Vue Flow でビジュアルワークフローを作成・編集するアプリケーション。型定義は `apps/frontend/src/types/` にあります。

## 開発ルール

- John Carmack, Robert C. Martin, Rob Pikeならどう設計するかを意識する
- **状態管理**: Pinia (`apps/frontend/src/stores/`) で実装
- **ロジック**: Composables (`apps/frontend/src/composables/`) に分離
- **コンポーネント**: ロジックを持たせず、propsとemitsでの単純な責務に限定
- **型安全性**: `any` は使わず、`apps/frontend/src/types/` で適切な型定義を行う
- **定数管理**: マジックナンバーや文字列は `apps/frontend/src/utils/` の定数ファイルを使用
- **品質保証**: lint や test でエラーが出たときはテストを無効化せず、根本原因を修正する
- **Vue 3 Composition API**: `<script setup>` を使用し、Reactiveな実装を心がける

## よく使うコマンド

```sh
# コード品質チェック
flow lint

# 全ての動作確認テスト (API + Frontend + MCP)
flow test

# フロントエンドテストのみ
flow test-frontend

# 単体テストのみ
flow test-unit

# E2Eテストのみ
flow test-e2e

# 本番ビルド
flow build

# 本番ビルドプレビュー
flow preview

# TypeScript型チェック
flow typecheck

# コード整形
flow format
```

## ディレクトリ構成

- `apps/frontend/src/components/` - Vue コンポーネント
  - `WorkflowEditor.vue` - メインのワークフローエディタ
  - `NodePalette.vue` - ノードパレット（左サイドバー）
  - `ExportPanel.vue` - エクスポート機能パネル
  - `nodes/CustomNode.vue` - カスタムノードコンポーネント
  - `AnimationControls.vue` - フローアニメーション制御
- `apps/frontend/src/stores/` - Pinia 状態管理
  - `workflow.ts` - ワークフロー関連の状態とアクション
- `apps/frontend/src/composables/` - 再利用可能なロジック
  - `useEdgeDepth.ts` - エッジの深度計算
  - `useNodeColors.ts` - ノードの色管理
- `apps/frontend/src/services/` - API通信
  - `api.ts` - バックエンドAPIとの通信
- `apps/frontend/src/types/` - TypeScript型定義
- `apps/frontend/src/utils/` - ユーティリティ関数・定数
  - `nodeTemplates.ts` - ノードテンプレート定義

## 技術スタック

### フロントエンド

- **Vue 3** (Composition API + `<script setup>`)
- **Vue Flow** - インタラクティブなフロー図エディタ
- **Pinia** - 状態管理
- **Tailwind CSS v4** - スタイリング
- **Monaco Editor** - コードエディタ
- **TypeScript** - 型安全性

### バックエンド

- **Express.js** - Web フレームワーク
- **TypeScript** - 型安全性
- **ファイルベース** - JSON データ永続化

### 開発・テスト

- **Vite** - ビルドツール
- **Vitest** - 単体テスト
- **Playwright** - E2E テスト
- **ESLint + Prettier** - コード品質

## Git コミット

指示の実行が完了するたびに以下の手順を実行してください

1. `flow lint` で linter を実行
2. `git add -A` で変更ファイルを追加
3. `git diff --cached` でハードコード確認。見つかれば `apps/frontend/src/utils/` から定数をインポートして置き換え
4. ここまで問題がなければ、変更されたファイルを確認やBashコマンド実行確認なしで自動的にコミット。コミットメッセージ形式：
   - 1行目: `[cc] <type>: <修正内容の概要>`（敬体で記述）
   - 空行
   - ユーザーの指示文字列をそのまま記載
   - 空行
   - 定型フッター
