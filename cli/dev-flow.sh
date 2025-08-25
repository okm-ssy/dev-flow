#!/bin/sh

set -e

dev_flow() {
  repository_root=$(
    cd "$(dirname "$0")"/..
    pwd
  )

  script_name=''
  subcommand=$1
  [ $# -gt 0 ] && shift
  case $subcommand in
  edit)
    script_name='edit.sh'
    ;;
  lint)
    script_name='front/lint.sh'
    ;;
  run)
    script_name='front/run.sh'
    ;;
  stop)
    script_name='stop.sh'
    ;;
  test)
    script_name='test-all.sh'
    ;;
  test-front | test-frontend)
    cd "${repository_root}/apps/frontend"
    exec "${repository_root}/cli/front/test.sh" all
    ;;
  test-unit)
    cd "${repository_root}/apps/frontend"
    exec "${repository_root}/cli/front/test.sh" unit
    ;;
  test-unit-coverage)
    cd "${repository_root}/apps/frontend"
    exec "${repository_root}/cli/front/test.sh" unit-coverage
    ;;
  test-e2e)
    cd "${repository_root}/apps/frontend"
    exec "${repository_root}/cli/front/test.sh" e2e
    ;;
  test-e2e-ui)
    cd "${repository_root}/apps/frontend"
    exec "${repository_root}/cli/front/test.sh" e2e-ui
    ;;
  build)
    cd "${repository_root}/apps/frontend"
    exec npm run build
    ;;
  preview)
    cd "${repository_root}/apps/frontend"
    exec npm run preview
    ;;
  typecheck)
    cd "${repository_root}/apps/frontend"
    exec npm run typecheck
    ;;
  format)
    cd "${repository_root}/apps/frontend"
    exec npm run format
    ;;
  api)
    cd "${repository_root}/apps/api"
    exec npm start
    ;;
  storybook)
    script_name='front/storybook.sh'
    ;;
  create_component | create-component)
    script_name='front/create_component.sh'
    ;;
  create_prompt_context | create-prompt-context)
    script_name='front/create_prompt_context.sh'
    ;;
  create_project | create-project)
    script_name='create-project.sh'
    ;;
  mcp-run)
    script_name='mcp/run.sh'
    ;;
  mcp-build)
    script_name='mcp/build.sh'
    ;;
  *)
    help && return
    ;;
  esac

  command="${repository_root}/cli/${script_name}"

  REPOSITORY_ROOT="$repository_root" \
    "$command" "$@"
}

help() {
  cat <<-END 1>&2

Dev Flow - Visual Workflow Editor

開発コマンド:
  run                           フロントエンド開発サーバーを起動（APIサーバーも同時起動）
  api                           APIサーバーのみを起動
  stop                          APIサーバーを停止

品質管理:
  lint                          ESLintコード品質チェックを実行
  typecheck                     TypeScript型チェックを実行
  format                        Prettierでコード整形

テスト:
  test                          全てのテスト実行 (API + Frontend + MCP)
  test-frontend                 フロントエンドテストのみ実行
  test-unit                     単体テストのみ実行
  test-unit-coverage            カバレッジ付き単体テスト実行
  test-e2e                      E2Eテストのみ実行
  test-e2e-ui                   インタラクティブE2Eテスト実行

ビルド:
  build                         本番用ビルド
  preview                       本番ビルドのプレビュー

その他:
  edit                          VS Codeで開く
  storybook                     Storybookを起動
  create-component              Vueコンポーネントとストーリーを作成
  create-prompt-context         AIプロンプト用ファイル結合
  create-project                新規プロジェクト作成
  mcp-run                       MCPサーバー開発モード起動
  mcp-build                     MCPサーバービルド
  help                          このヘルプを表示
END
}

dev_flow "$@"
