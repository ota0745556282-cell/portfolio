# 太田健吾 — Portfolio

エンジニア就職活動用のポートフォリオサイト。ビルドツールを使わず、HTML / CSS / JavaScript のみで構築しています。

**公開URL:** <!-- TODO: 公開したらURLを貼る -->

## 構成

```
index.html    マークアップ（全セクション）
style.css     スタイル。:root の CSS 変数でテーマを一元管理
script.js     スクロール表示 / ナビのハイライト / アドレスのコピー
favicon.svg   ファビコン
```

## 実装している内容

- **CSS 変数によるテーマ設計** — 配色を `:root` に集約し、`prefers-color-scheme` でダークモードに対応
- **IntersectionObserver** — スクロールに応じた要素の表示と、現在位置に応じたナビのハイライト
- **フォールバック** — JavaScript が読み込めない場合でも `<noscript>` と CSS アニメーションで本文が表示される
- **アクセシビリティ** — スキップリンク、`:focus-visible` のフォーカス表示、`prefers-reduced-motion` への対応
- **SEO / OGP** — メタディスクリプション、OGP タグ、JSON-LD（`Person`）

## ローカルで動かす

ビルド不要です。`index.html` をブラウザで開くか、簡易サーバーを立ち上げます。

```bash
python -m http.server 8000
```

## 公開手順（GitHub Pages）

1. GitHub にリポジトリを作成して push する
2. Settings → Pages → Source を `main` ブランチのルートに設定する
3. 数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開される
4. 公開URLを `index.html` の `canonical` / `og:url` / JSON-LD の `url`、およびこの README に反映する

## TODO

- [ ] Works の「喪失世界」の説明・技術スタック・GitHubリンクを埋める
- [ ] Career の年月を実際の経歴に差し替える
- [ ] Contact の GitHub / X のリンクを設定する
- [ ] og-image.png（1200×630）を用意して OGP タグを有効化する
- [ ] 公開URLを各所に反映する
