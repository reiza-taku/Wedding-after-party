# Wedding-after-party

## コミットメッセージのルール

コミットメッセージは、変更内容が分かりやすいように以下の形式で記述します。

```text
<Prefix>: <変更内容>
```

例：

```text
feat: ユーザーのプロフィール編集機能を追加
```

| Prefix | 意味・用途 | 使用例 |
| --- | --- | --- |
| `feat` | 新しい機能の追加 | `feat: ユーザーのプロフィール編集機能を追加` |
| `fix` | バグ修正 | `fix: ログイン時にセッションが切れる問題を修正` |
| `docs` | ドキュメントの修正・更新 | `docs: READMEに開発環境のセットアップ手順を追加` |
| `style` | 見た目の変更（動作に影響なし） | `style: コードのインデントをスペースに統一` |
| `refactor` | 機能変更なしのコード改善（リファクタリング） | `refactor: 複雑な条件分岐を関数に分割` |
| `perf` | パフォーマンス改善 | `perf: クエリの実行速度を最適化` |
| `test` | テストコードの追加・変更 | `test: 商品購入処理のユニットテストを追加` |
| `chore` | 設定ファイルなどの雑務 | `chore: eslintの設定を追加` |
| `build` | ビルド関連の変更 | `build: production用にwebpack設定を変更` |
| `ci` | CIツール関連の設定 | `ci: GitHub Actionsでテストを実行するよう追加` |
| `revert` | 以前の変更を取り消し | `revert: feat: 画像アップロード機能を追加 を取り消し` |
| `add` | ファイルやライブラリの追加 | `add: axiosライブラリを追加` |
| `update` | 既存の機能やライブラリを更新 | `update: bootstrapのバージョンを5に更新` |
| `hotfix` | 緊急バグ修正 | `hotfix: 本番環境で発生していたクラッシュを修正` |
| `clean` | 不要なコードの削除など | `clean: 未使用のimport文を削除` |
| `disable` | 機能の一時的な無効化 | `disable: お知らせバナーの表示を一時的に停止` |
| `remove` | ファイルや機能の削除 | `remove: 旧ログイン画面のコードを削除` |
| `delete` | ファイルの削除 | `delete: debug用ログ出力処理を削除` |
| `rename` | ファイルや関数名の変更 | `rename: UserList.js を MemberList.js に変更` |
| `move` | ファイルの移動 | `move: assetsディレクトリに画像ファイルを移動` |
| `upgrade` | ライブラリなどのバージョンアップ | `upgrade: Reactを18.0にアップグレード` |