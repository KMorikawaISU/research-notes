# Research Notes の使い方

公開サイト: <https://kmorikawaisu.github.io/research-notes/>

Google Sites のホームページ: <https://sites.google.com/site/kosukemorikawa/home>

このリポジトリは、Obsidian で書いた Markdown ノートを Quartz 5 で Web サイトに変換し、GitHub Pages で公開するためのものです。Google Sites の「Research Notes」から開く構成です。Obsidian Publish や Obsidian Sync の契約は必要ありません。

## 最初に入っているページ

`content/` に、トップページと Linear Algebra、Multivariate Data Analysis、Principal Component Analysis、Singular Value Decomposition の短いサンプルがあります。すべて「Starter example」と明示した出発点です。自分の勉強内容に合わせて編集・追加してください。

## まずブラウザーだけで更新する

1. [GitHub のリポジトリ](https://github.com/KMorikawaISU/research-notes)を開きます。
2. `content/` 内の編集したい `.md` ファイルを開き、鉛筆アイコンで編集します。
3. 内容を確認して `Commit changes` を実行します。公開用の `v5` ブランチへの変更が保存されると、自動でサイトが再構築されます。
4. `Actions` タブで `Deploy research notes to GitHub Pages` が成功したことを確認し、公開サイトを再読み込みします。

## Obsidian で書く

1. このリポジトリを自分の Mac に clone します。GitHub Desktop を使う場合は、対象のリポジトリを選んでローカルに保存します。
2. Obsidian の `Open folder as vault` で、clone したリポジトリの **`content` フォルダー**を選びます。
3. ノートを編集・保存します。新しいノートは `.md` ファイルとして追加します。
4. 公開したい変更を GitHub Desktop などで commit し、GitHub に push します。
5. GitHub Actions が成功すると、同じ公開 URL に変更が反映されます。

**Obsidian で保存しただけでは Web サイトは更新されません。GitHub への push が公開更新の操作です。**

## ノート同士をつなぐ

ノート内に、次のように書きます。

```markdown
この方法の背景には [[Linear Algebra]] があります。
[[Principal Component Analysis|PCA]] とも関係します。
```

リンク先と同じ名前のノートを用意すると、リンクとグラフに反映されます。グラフはリンクから作られます。内容の意味を自動判定して類似度を計算するものではありません。

数式は、文中なら `$x^\top x$`、独立した数式なら次のように書きます。

```markdown
$$
S=\frac{1}{n-1}X^\top X.
$$
```

新しいページの基本形です。

```markdown
---
title: New Topic
description: このノートの短い説明。
---

## 要点

学んだ内容を書きます。

## 関連するノート

- [[Linear Algebra]]
```

## 公開用のノートの置き場所

GitHub Free で GitHub Pages を利用するため、このリポジトリは公開用です。**`content/` には、Web と GitHub の両方で公開してよい内容だけを置いてください。** 未発表の研究や個人情報は、別の Obsidian Vault に保管する運用が分かりやすいです。

`draft: true` は Quartz の公開ページから除外する設定です。公開リポジトリに commit した元ファイル自体を非公開にする機能ではありません。

## ローカルで表示を確認する場合

単に Obsidian でノートを書き、GitHub に push するだけなら、手元で Quartz を動かす必要はありません。ローカルの Web 表示も確認したい場合は、Node.js 22 以上と npm 10.9.2 以上を用意し、リポジトリのルートで実行します。

```bash
npm ci
npx quartz plugin install
npx quartz build --serve
```

ブラウザーで <http://localhost:8080> を開きます。

## 公開設定

- サイトのタイトルや URL: `quartz.config.yaml`
- 公開ノート: `content/`
- 自動公開: `.github/workflows/deploy.yml`
- GitHub の公開元: `Settings` → `Pages` → `GitHub Actions`
- 自動公開するブランチ: `v5`

この設定では数式、検索、ノート間リンク、Graph View、Backlinks を使えます。アクセス解析は無効です。

## 公式資料

- [Quartz のインストール](https://quartz.jzhao.xyz/getting-started/installation)
- [Quartz の GitHub Pages 公開](https://quartz.jzhao.xyz/hosting)
- [Quartz の Graph View](https://quartz.jzhao.xyz/features/graph-view)
- [Quartz の非公開ページ設定と注意点](https://quartz.jzhao.xyz/features/private-pages)
- [GitHub Pages の利用条件](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
