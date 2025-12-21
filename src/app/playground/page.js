'use client';

import TiptapMaxEditor from '@/components/editor/TiptapMaxEditor';
import Link from 'next/link';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react';

export default function PlaygroundPage() {
    const [showActions, setShowActions] = useState(true);

    const handleDownloadHTML = () => {
        const content = localStorage.getItem('tiptap-max-content') || '';
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tiptap-max-content-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleClearContent = () => {
        if (confirm('Are you sure you want to clear all content? This action cannot be undone.')) {
            localStorage.removeItem('tiptap-max-content');
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
            {/* Top Navigation Bar */}
            <div className="top-0 z-50 border-b border-[var(--border-secondary)] backdrop-blur-xl bg-[var(--bg-base)]/80">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left: Back button and breadcrumb */}
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-secondary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300 text-[var(--text-secondary)] hover:text-[var(--color-primary)]"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Back to Home</span>
                            </Link>
                            <div className="hidden md:flex items-center gap-2 text-sm text-[var(--text-muted)]">
                                <span>Home</span>
                                <span>/</span>
                                <span className="text-[var(--color-primary)] font-semibold">Playground</span>
                            </div>
                        </div>

                        {/* Center: Logo (hidden on mobile) */}
                        <div className="hidden lg:flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                                <span className="text-white font-bold">T</span>
                            </div>
                            <span className="font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                                Tiptap-Max
                            </span>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDownloadHTML}
                                className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-secondary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300 text-[var(--text-secondary)] hover:text-[var(--color-primary)] group"
                                title="Download as HTML"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleClearContent}
                                className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-secondary)] hover:border-red-500 hover:bg-red-500/10 transition-all duration-300 text-[var(--text-secondary)] hover:text-red-500 group"
                                title="Clear all content"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Container */}
            <div className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Info Banner */}
                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 border border-[var(--border-primary)]">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">✓</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-[var(--text-primary)] font-semibold mb-1">
                                    Auto-save enabled
                                </p>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Your content is automatically saved to your browser's local storage. Try refreshing the page—your work will persist!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="animate-fadeIn">
                        <TiptapMaxEditor />
                    </div>

                    {/* Keyboard Shortcuts Help */}
                    <div className="mt-6 p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-secondary)]">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                            ⌨️ Keyboard Shortcuts
                        </h3>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            {[
                                { keys: 'Ctrl/⌘ + B', desc: 'Bold' },
                                { keys: 'Ctrl/⌘ + I', desc: 'Italic' },
                                { keys: 'Ctrl/⌘ + U', desc: 'Underline' },
                                { keys: 'Ctrl/⌘ + Shift + H', desc: 'Highlight' },
                                { keys: 'Ctrl/⌘ + Z', desc: 'Undo' },
                                { keys: 'Ctrl/⌘ + Shift + Z', desc: 'Redo' },
                            ].map((shortcut, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <kbd className="px-2 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-secondary)] text-xs text-[var(--text-muted)] font-mono whitespace-nowrap">
                                        {shortcut.keys}
                                    </kbd>
                                    <span className="text-[var(--text-secondary)]">{shortcut.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Hint (Mobile) */}
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleDownloadHTML}
                        className="p-4 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-[var(--shadow-button)] hover:scale-110 transition-all duration-300"
                        title="Download HTML"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
