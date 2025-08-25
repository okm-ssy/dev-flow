# E2E Testing with Playwright

このディレクトリにはPlaywrightを使用したE2Eテストが含まれています。

## セットアップ

```bash
# Playwrightブラウザのインストール
npm run playwright:install
```

## テスト実行

```bash
# 通常のテスト実行（ヘッドレスモード）
npm run test:e2e

# UIモードでテスト実行（ブラウザが見える）
npm run test:e2e:headed

# インタラクティブなUIモード
npm run test:e2e:ui

# デバッグモード
npm run test:e2e:debug
```

## テストファイル

- `workflow-editor.spec.ts`: メインのワークフローエディタのテスト
- `node-palette.spec.ts`: ノードパレットの機能テスト

## テスト内容

### ワークフローエディタ
- ✅ アプリケーションの読み込み
- ✅ ノードの重複なし配置
- ✅ ノードエディタパネルの表示
- ✅ JSONエクスポート機能
- ✅ エラー通知の表示
- ✅ ノード間の接続
- ✅ ノードタイプ別の色分け

### ノードパレット
- ✅ 全ノードタイプの表示
- ✅ ノード追加機能
- ✅ アイコンの表示
- ✅ ユニークID生成

## 設定

`playwright.config.ts`でテスト設定を管理：
- ベースURL: http://localhost:5151
- 自動的にdev serverを起動
- Chrome、Firefox、Safariでテスト
- エラー時にスクリーンショット自動保存