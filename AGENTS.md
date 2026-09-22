# AGENTS.md

Astro 5 + React 19 + Tailwind CSS 4 + MDX の静的サイト（ポートフォリオ＋ブログ）。
CVfolio テンプレートを fork して個人用にカスタムしている。単一パッケージ（monorepo ではない）。

## コマンドと検証

package.json のスクリプトは以下のみ（lint / test / format のタスクは存在しない）。

```sh
npm run dev      # ローカル開発 (localhost:4321)
npm run build    # 本番ビルド → dist/
npm run preview  # ビルド結果のプレビュー
```

- 唯一の検証手段は `npm run build`（全5ページの静的生成）。変更後はこれを通すこと。
- ビルド時の警告 `The collection "talks" does not exist or is empty` は talks が 0 件なためで正常。
- `npx tsc --noEmit` は `astro.config.mjs` の既知の型エラー1件（`@tailwindcss/vite` の Vite プラグイン型の不一致）で常に失敗する。追わない・直そうとしない。
- `astro check` は `@astrojs/check` / `typescript` が未導入でそのままでは使えない。
- `.prettierrc`（singleQuote）があるが prettier 本体は依存に無く、フォーマットは強制されない。

## パッケージマネージャとデプロイ

- パッケージマネージャは npm。`package-lock.json` が唯一のロックファイル（正）。
- 依存の追加・変更・削除は必ず npm で行い、`package-lock.json` を変更とあわせてコミットする。
- デプロイは `.github/workflows/deploy.yml` の `withastro/action@v5`。`main` への push で GitHub Pages へ自動デプロイされる（カスタムドメインは `public/CNAME`）。CI はロックファイルから npm を検出して `npm install` + `npm run build` する。
- main へ直接 push せず `feat/` `fix/` ブランチから PR する（README 方針）。

## 構成の要点（ファイル名からは分からないこと）

- `config.yml`（リポジトリルート）でセクション・要素の表示切替（`sections` / `elements`）。
  `src/lib/config.ts` の `getSiteConfig()` がビルド時に `process.cwd()` から読むため、コマンドはリポジトリルートで実行する。
  値が壊れていると警告を出してデフォルトにフォールバックする（黙って表示が変わる）。
- サイト URL は `astro.config.mjs` の `site`。`src/lib/constants.ts` が `astro.config.mjs` を import して `baseUrl` を解決する。
  著者情報・SEO デフォルトも `constants.ts` にハードコード（デフォルトは `robots: 'noindex, nofollow'`）。
- コンテンツは Astro Content Layer（`src/content.config.ts`、glob loader）で 5 コレクション。
  frontmatter は zod スキーマで検証され、違反はビルドを止める。
  - `posts` — ブログ記事。`src/content/posts/<slug>/index.mdx`（画像同梱はフォルダ形式）が `/writing/<slug>` に生成される
    （`src/pages/writing/[...slug].astro` が `entry.id` を URL にする）。
  - `pages` — `src/content/pages/`（`homepage` / `writing/index` / `404` が実体）。
  - `jobs` — 職歴（`title, company, location, from, to?, url, images?`）。
  - `talks` — 登壇（`title, year, event, location, url`）。現状 0 件で `config.yml` も `talks: false`。
  - `links` — `src/content/links/*.yml`（`label, name, url`）。
- `posts` / `pages` は `seo.title` と `seo.description` が**必須**（トップレベルの `title` とは別物）。
- 記事の読み時間は `src/lib/remark.mjs`（remarkReadingTime）が frontmatter に `minutesRead` として注入する。手動で書かない。
- フォントは Astro の実験的機能 `experimental.fonts`（`astro.config.mjs`）＋ローカルの woff2（`src/assets/fonts/`）。
  足すにはファイル配置と `astro.config.mjs` の `variants` 追記の両方が必要。
- Tailwind は v4（`@tailwindcss/vite`）だが `tailwind.config.mjs` を `src/styles/global.css` の `@config` で併用（prose のカスタム用）。
  テーマ値（`@theme inline` の CSS 変数）は `global.css`、ダークモードは `.dark` クラスで切替。
- パスエイリアス `@/*` → `src/*`。

## ドキュメントの注意

- `docs/` はテンプレート由来で古い（`docs/project-structure.md` は Astro 初期状態の説明、
  `docs/guides/how-to-deploy-github-pages.md` は元作者の URL のまま）。実態は設定・コードを優先すること。
