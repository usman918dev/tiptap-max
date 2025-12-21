'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Tiptap
const BlogEditor = dynamic(() => import('./BlogEditor'), {
    ssr: false,
    loading: () => (
        <div className="editor-container animate-pulse">
            <div className="editor-toolbar h-12 bg-[var(--editor-toolbar-bg)]"></div>
            <div className="min-h-[300px] bg-[var(--editor-bg)] flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[var(--text-secondary)]">Loading editor...</span>
                </div>
            </div>
        </div>
    ),
});

const STORAGE_KEY = 'tiptap-max-content';

const DEFAULT_CONTENT = `
<h1>Welcome to Tiptap-Max ✨</h1>
<p>This is a <strong>premium rich text editor</strong> built on Tiptap. Start typing to experience the power of modern content editing!</p>
<h2>Features you can try:</h2>
<ul>
  <li>✏️ <strong>Bold</strong>, <em>italic</em>, and <u>underline</u> text</li>
  <li>📋 Bullet and numbered lists</li>
  <li>💻 Code blocks with syntax highlighting</li>
  <li>📊 Tables with resizable columns</li>
  <li>🖼️ Image embedding</li>
  <li>🔗 Links with custom styling</li>
</ul>
<blockquote>
  <p>💡 <strong>Pro tip:</strong> Your content is automatically saved to local storage!</p>
</blockquote>
<a href="techo.com">techo</a>
<p>Try editing this text and refresh the page - your changes will persist.</p>
`;

export default function TiptapMaxEditor() {
    const [content, setContent] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // Load content from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedContent = localStorage.getItem(STORAGE_KEY);
            if (savedContent) {
                setContent(savedContent);
            } else {
                setContent(DEFAULT_CONTENT);
            }
            setIsLoaded(true);
        }
    }, []);

    // Save content to localStorage on change
    const handleContentChange = useCallback((newContent) => {
        setContent(newContent);
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, newContent);
            setLastSaved(new Date());
        }
    }, []);

    // Clear content handler
    const handleClear = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
            setContent(DEFAULT_CONTENT);
            setLastSaved(null);
        }
    }, []);

    if (!isLoaded) {
        return (
            <div className="editor-container animate-pulse">
                <div className="editor-toolbar h-12 bg-[var(--editor-toolbar-bg)]"></div>
                <div className="min-h-[300px] bg-[var(--editor-bg)] flex items-center justify-center">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[var(--text-secondary)]">Loading editor...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <BlogEditor
                content={content}
                onChange={handleContentChange}
                placeholder="Start writing something amazing..."
            />

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-secondary)]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-[var(--text-muted)]">
                        {lastSaved
                            ? `Auto-saved at ${lastSaved.toLocaleTimeString()}`
                            : 'Content auto-saves to local storage'
                        }
                    </span>
                </div>
                <button
                    onClick={handleClear}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                    Reset to default
                </button>
            </div>
        </div>
    );
}
