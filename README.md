# AiShort (ChatGPT Shortcut) - React Application

A modern, fast, and feature-rich AI prompt management and productivity shortcut directory for ChatGPT, Claude, Midjourney, Gemini, DeepSeek, and top AI tools.

Rewritten as a standard, standalone **React + Vite** single-page application with TypeScript, Ant Design, and Tailwind CSS.

## Features

- **Prompt Catalog & Search**: Instant full-text search across titles, prompts, remarks, and tags.
- **Multilingual Support**: Fully localized with 18 languages (English, 简体中文, 繁體中文, 日本語, 한국어, Español, Français, Deutsch, etc.).
- **Interactive Placeholders**: Live bracketed variable extraction (`[variable]`) with dynamic in-place preview and 1-click clipboard copy.
- **View Modes**: Switch dynamically between spacious Grid card view and high-density Compact list view.
- **My Space (Personal Library)**:
  - Star and collect favorite prompts with local storage persistence.
  - Create, edit, and delete custom personal prompts.
  - Custom tag organization and categorization.
  - JSON Backup Export and Import for complete data portability across devices.
- **Community Hub**: Community prompt discovery, interactive upvoting/downvoting, and prompt submission.
- **Documentation & Guides**: Built-in prompt engineering guides, browser extension setup, and workflow tips.
- **Dark & Light Mode**: Seamless dark/light theme switching with Ant Design design tokens.

## Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Production build
npm run build
```

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Components**: Ant Design (antd 6) & @ant-design/icons
- **Styling**: Tailwind CSS + Custom Teal-ink Theme Tokens
