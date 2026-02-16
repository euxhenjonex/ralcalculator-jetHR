# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RAL Calculator — a Next.js 16 application using React 19, TypeScript 5, and Tailwind CSS v4 with the App Router pattern.

## Commands

- **Dev server:** `npm run dev` (starts on localhost:3000)
- **Build:** `npm run build`
- **Start production:** `npm run start`
- **Lint:** `npm run lint` (ESLint 9 flat config)
- No test framework is configured yet.

## Architecture

- **App Router** (`app/` directory) with React Server Components by default
- **Path alias:** `@/*` maps to the project root
- **Styling:** Tailwind CSS v4 using `@import "tailwindcss"` syntax with CSS custom properties for theming (dark mode via `prefers-color-scheme`)
- **Fonts:** Geist Sans and Geist Mono loaded via `next/font`
- **TypeScript:** Strict mode enabled, target ES2017, bundler module resolution
