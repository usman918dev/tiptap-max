# Tiptap-Max Copilot Instructions

## Project Overview
**Tiptap-Max** is a premium, feature-rich rich text editor built on [Tiptap](https://tiptap.dev/) using Next.js 15, React 19, and Tailwind CSS v4. It provides advanced content editing capabilities with a modern UI and dark/light theme support.

## Architecture & Key Components

### Component Structure
- **TiptapMaxEditor** (`src/components/editor/TiptapMaxEditor.jsx`): Container component that manages editor state, localStorage persistence, and dynamic loading
  - Uses `next/dynamic` with SSR disabled to prevent hydration mismatches
  - Implements localStorage auto-save with `STORAGE_KEY = 'tiptap-max-content'`
  - Provides loading skeleton UI during hydration
  
- **BlogEditor** (`src/components/editor/BlogEditor.jsx`): Core Tiptap editor (1018 lines) with toolbar and extensions
  - Includes 15+ Tiptap extensions (tables, images, code blocks, text alignment, etc.)
  - Uses Lucide React icons for toolbar buttons
  - Custom `HtmlBlock` extension for HTML content preservation
  - Cloudinary integration for image uploads (currently mocked)
  - Radix UI dropdown menus for complex toolbar controls

- **ThemeToggle** (`src/components/ThemeToggle.jsx`): Dark/light mode toggle
  - Persists theme to localStorage and applies `data-theme` attribute to `<html>`
  - Includes hydration-safe mounting check

### Data Flow
1. User edits content in `BlogEditor` → onChange callback fires
2. `TiptapMaxEditor` receives change and updates local state + localStorage
3. Theme changes via `ThemeToggle` → CSS variables update via `data-theme` attribute

## Styling & Theme System

### CSS Architecture (`src/app/globals.css`)
- **Tailwind v4** with custom `@source` directives to scan `src/components` and `src/app`
- **CSS variables** for theming (200+ lines): primary/accent colors, gradients, shadows, spacing
- **Dark theme default** (`--bg-base: #0a0a0f`, purple primary `#8b5cf6`, gold accent `#f59e0b`)
- Light theme overrides available via `[data-theme="light"]` selector

### Key CSS Variables Pattern
```css
/* Dark mode (default) */
:root { --color-primary: #8b5cf6; --bg-base: #0a0a0f; }

/* Light mode */
[data-theme="light"] { --color-primary: #6366f1; --bg-base: #f8fafc; }
```

## Development Workflow

### Build & Run
```bash
npm run dev      # Start Next.js dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Run Next.js linting
```

### Key Configuration Files
- **next.config.mjs**: Image domains whitelisted for Cloudinary and Unsplash
- **postcss.config.mjs**: Tailwind v4 integration
- **jsconfig.json**: Path aliases (@/components, @/lib)

## Project-Specific Patterns & Conventions

### 1. Server Components vs Client Components
- All editor components use `'use client'` directive (required for interactivity)
- `TiptapMaxEditor` uses dynamic import with `ssr: false` to prevent hydration errors with Tiptap

### 2. Utility Functions (`src/lib/tiptap-utils.js`)
- **Platform detection**: `isMac()` checks navigator platform
- **Keyboard shortcuts**: `formatShortcutKey()` converts shortcuts to platform symbols (Mac: ⌘, Windows: Ctrl)
- **MAC_SYMBOLS map**: Defines special key representations for UI display
- **File limits**: `MAX_FILE_SIZE = 5MB` for uploads

### 3. Storage & Persistence
- LocalStorage key: `tiptap-max-content` (content), `theme` (theme preference)
- Auto-save on every content change in `TiptapMaxEditor.handleContentChange()`
- Load content on mount before first render to prevent blank state flicker

### 4. Extension Configuration Pattern (BlogEditor)
Extensions are initialized via Tiptap's configuration:
```javascript
// Core
StarterKit, Underline, Link, Image, TextAlign

// Rich content
Table, TableRow, TableHeader, TableCell
CodeBlockLowlight, Highlight, HorizontalRule

// Text styling
Typography, Subscript, Superscript
```

### 5. Cloudinary Integration
- File uploading happens through `uploadToCloudinary()` in `src/lib/cloudinary.js`
- Currently **mocked** for demo (returns object URL with 1.5s delay)
- Replace with actual Cloudinary SDK for production
- Image domains in next.config: `res.cloudinary.com`, `images.unsplash.com`

## Critical Conventions

1. **Hydration Safety**: Always wrap client-side state initialization in `useEffect` with `typeof window !== 'undefined'` checks
2. **Dynamic Imports**: Tiptap components must use `next/dynamic` with `ssr: false` to avoid SSR conflicts
3. **Theme Application**: Changes applied via `document.documentElement.setAttribute('data-theme', newTheme)`
4. **Toolbar Structure**: Use Radix UI dropdown menu for complex controls; Lucide icons for all buttons
5. **Error Boundaries**: Not yet implemented but recommended for image upload failures

## File Locations Reference
- Editor components: `src/components/editor/`
- Utilities & helpers: `src/lib/` (tiptap-utils, cloudinary)
- Global styles: `src/app/globals.css` (theme CSS variables)
- Landing page: `src/components/landing/Hero.jsx`
- App layout/metadata: `src/app/layout.js`

## External Dependencies to Know
- **@tiptap/react**: Editor core and hooks
- **@tiptap/starter-kit**: Base extensions (bold, italic, code, lists, etc.)
- **lucide-react**: 45+ icon references in toolbar
- **lowlight + code-block-lowlight**: Syntax highlighting for code blocks
- **@radix-ui/react-dropdown-menu**: Accessible dropdown menus
- **Tailwind CSS v4**: Styling with CSS variables override support
