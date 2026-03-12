'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { DEFAULT_CONTENT } from '@/lib/defaultContent';

// Dynamic import to avoid SSR issues with Tiptap
const Editor = dynamic(() => import('./Editor'), {
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

export default function TiptapMaxEditor({ tier = 'pro', dragHandleEnabled = false, onEditorReady }) {
    const [content, setContent] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const editorRef = useRef(null);

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

    // Handle editor ready callback
    const handleEditorReady = useCallback((editor) => {
        editorRef.current = editor;
        onEditorReady?.(editor);
    }, [onEditorReady]);

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
            {/* Key forces re-initialization when tier or dragHandle changes */}
            <Editor
                key={`${tier}-${dragHandleEnabled}`}
                content={content}
                onChange={handleContentChange}
                onEditorReady={handleEditorReady}
                placeholder="Start writing something amazing..."
                tier={tier}
                dragHandleEnabled={dragHandleEnabled}
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
