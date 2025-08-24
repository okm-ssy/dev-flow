# 設計ドキュメント

## 概要

Node-based Workflow Documentation Toolは、エンジニアがワークフローを視覚的に文書化できるWebアプリケーションです。React + React Flowをベースとし、ドラッグ&ドロップでノードを配置し、MarkdownとJSON形式でエクスポートできます。

## アーキテクチャ

### 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ノードエディター**: React Flow
- **スタイリング**: Tailwind CSS
- **コードエディター**: Monaco Editor
- **状態管理**: React Context + useReducer
- **ストレージ**: IndexedDB (Dexie.js)

### アプリケーション構造

```
src/
├── components/
│   ├── NodeEditor/
│   ├── NodeTypes/
│   ├── CodeEditor/
│   └── ExportPanel/
├── hooks/
├── types/
├── utils/
└── stores/
```

## コンポーネントとインターフェース

### 1. NodeEditor コンポーネント

React Flowをラップするメインエディター

```typescript
interface NodeEditorProps {
  nodes: WorkflowNode[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
}
```

### 2. カスタムノードタイプ

#### BaseNode

```typescript
interface BaseNodeData {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  code: string;
  inputs: string[];
  outputs: string[];
  notes?: string;
}
```

#### 特化ノードタイプ

- **BigQueryNode**: SQL専用、BigQueryアイコン
- **PostgreSQLNode**: SQL専用、PostgreSQLアイコン
- **AWSNode**: JavaScript/Python、AWSアイコン
- **SlackNode**: API呼び出し専用、Slackアイコン
- **CustomNode**: 汎用、カスタマイズ可能

### 3. CodeEditor コンポーネント

Monaco Editorをラップ

```typescript
interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  theme?: 'vs-dark' | 'vs-light';
}
```

### 4. ExportPanel コンポーネント

エクスポート機能を管理

```typescript
interface ExportPanelProps {
  workflow: WorkflowData;
  onExportMarkdown: () => void;
  onExportJSON: () => void;
  onExportSVG: () => void;
}
```

## データモデル

### WorkflowNode

```typescript
interface WorkflowNode extends Node {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    title: string;
    description: string;
    code: string;
    inputs: string[];
    outputs: string[];
    nodeType: 'bigquery' | 'postgresql' | 'aws' | 'slack' | 'custom';
  };
}
```

### WorkflowData

```typescript
interface WorkflowData {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: Edge[];
  createdAt: Date;
  updatedAt: Date;
}
```

### エクスポート形式

#### Markdown出力例

```markdown
# ワークフロー名

## 概要
ワークフローの説明

## ステップ

### 1. BigQuery データ抽出
説明文

```sql
SELECT * FROM dataset.table
WHERE condition = true
```

**入力**: なし
**出力**: データセット

### 2. データ変換

...

```

#### JSON出力例
```json
{
  "workflow": {
    "id": "workflow-123",
    "name": "データ処理ワークフロー",
    "nodes": [
      {
        "id": "node-1",
        "type": "bigquery",
        "title": "データ抽出",
        "code": "SELECT * FROM...",
        "position": {"x": 100, "y": 100}
      }
    ],
    "connections": [...]
  }
}
```

## エラーハンドリング

### 1. ノード操作エラー

- 無効なコード入力時の警告表示
- ノード接続時の循環参照チェック
- 必須フィールド未入力時の検証

### 2. エクスポートエラー

- 空のワークフロー時の警告
- ファイル生成失敗時のフォールバック
- ブラウザ互換性チェック

### 3. ストレージエラー

- IndexedDB利用不可時のLocalStorageフォールバック
- データ破損時の復旧機能
- 容量制限時の警告

## テスト戦略

### 1. ユニットテスト

- 各コンポーネントの単体テスト
- エクスポート機能のロジックテスト
- データ変換ユーティリティのテスト

### 2. 統合テスト

- ノード作成から接続までのフロー
- エクスポート機能の端到端テスト
- ストレージ機能のテスト

### 3. E2Eテスト

- ユーザーシナリオベースのテスト
- ブラウザ間互換性テスト
- パフォーマンステスト

### テストツール

- **ユニット**: Jest + React Testing Library
- **E2E**: Playwright
- **視覚回帰**: Chromatic (Storybook)
- **Lint**: ESLint + Prettier
- **型チェック**: TypeScript strict mode

## パフォーマンス考慮事項

### 1. 大規模ワークフロー対応

- 仮想化によるノード描画最適化
- 遅延読み込みによるメモリ使用量削減
- デバウンス処理による不要な再描画防止

### 2. エクスポート最適化

- Web Workerによるバックグラウンド処理
- ストリーミング処理による大容量対応
- プログレス表示によるUX向上

### 3. ストレージ最適化

- 差分保存による容量削減
- 圧縮アルゴリズムの適用
- 自動クリーンアップ機能
