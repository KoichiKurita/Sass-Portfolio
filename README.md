# Sass Portfolio

## 🚀 Overview
実務を想定したフロントエンド設計と
UIロジック実装をまとめたポートフォリオです。

設計思想・パフォーマンス・保守性を重視しています。

🔗 Live Site  
https://KoichiKurita.github.io/Sass-Portfolio/

---

## 🌟 Featured Project
### Task Management App

- CRUD操作
- 状態管理
- localStorage保存
- フィルタリング機能
- モジュール分離

設計意図：
UIとロジックの責務分離を意識しました。

---

## 🏗 Architecture

### 🎯 CSS Architecture
- ITCSSレイヤー構造
- FLOCSS命名規則
- Design Token管理（Sass + CSS変数併用）
- Mobile First設計

### ⚙ Build Environment
- Vite（高速ビルド & HMR）
- Sass（@use / @forward管理）
- ESLint
- Stylelint
- GitHub Actions（CI/CD）

---

## 🧠 Why This Architecture?

大規模化を想定し、
CSSの依存関係を明確化するため
ITCSSを採用しました。

変更の影響範囲を最小化できる設計です。

---

## 📊 Performance

Lighthouse (Mobile)

- Performance: 91+
- Accessibility: 96+
- Best Practices: 100
- SEO: 100

パフォーマンス最適化内容：

- 画像最適化
- 不要JS削減
- CSS最小化
- clip-path軽量化
- 適切なmetaタグ設定

---

## ✨ Features

- ダーク / ライトテーマ切替
- スクロールアニメーション
- IntersectionObserver使用
- スムーススクロール
- ガラスモーフィズムUI

---

## 🧠 What I Focused On

- 設計の明確化
- 保守性
- 可読性
- パフォーマンス最適化
- 実務を意識した構成

---

## 🛠 Tech Stack

- HTML5
- Sass (ITCSS + FLOCSS)
- Vite
- JavaScript (ES Modules)
- GitHub Pages

---

## 📂 Setup

```bash
npm install
npm run dev
```

---

## Development Note

This project was developed with the assistance of AI tools (ChatGPT) for architectural guidance, debugging, and best practices.

All integration, configuration, and final implementation were performed and validated by the author.

---

## 👨‍💻 Author

Koichi Kurita