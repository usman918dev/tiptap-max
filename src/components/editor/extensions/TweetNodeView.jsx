'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    Trash2,
    GripVertical
} from 'lucide-react';

export default function TweetNodeView({ node, updateAttributes, deleteNode, selected }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef(null);
    const tweetContainerRef = useRef(null);
    const resizeStartX = useRef(0);
    const resizeStartWidth = useRef(0);

    const { tweetUrl, width, align } = node.attrs;

    const handleResizeStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        resizeStartX.current = e.clientX;
        resizeStartWidth.current = width;

        const handleMouseMove = (moveEvent) => {
            const delta = moveEvent.clientX - resizeStartX.current;
            const newWidth = Math.max(300, Math.min(600, resizeStartWidth.current + delta * 2));
            updateAttributes({ width: newWidth });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleAlignChange = (newAlign) => {
        updateAttributes({ align: newAlign });
    };

    // Load Twitter widget - only when URL changes
    useEffect(() => {
        if (!tweetContainerRef.current || !tweetUrl) return;

        const container = tweetContainerRef.current;
        let isCancelled = false;

        // Clear any existing content safely
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const loadWidget = () => {
            if (isCancelled) return;
            if (window.twttr && window.twttr.widgets && container) {
                // Check if already has a twitter widget iframe
                if (container.querySelector('iframe')) return;

                // Create blockquote for Twitter embed
                const blockquote = document.createElement('blockquote');
                blockquote.className = 'twitter-tweet';
                blockquote.setAttribute('data-dnt', 'true');

                const anchor = document.createElement('a');
                anchor.href = tweetUrl;
                anchor.textContent = 'Loading tweet...';
                blockquote.appendChild(anchor);

                container.appendChild(blockquote);

                window.twttr.widgets.load(container).then(() => {
                    if (!isCancelled) setIsLoaded(true);
                }).catch(() => {
                    if (!isCancelled) setIsLoaded(true);
                });
            }
        };

        // Load Twitter widget script if not already loaded
        if (!window.twttr) {
            const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = 'https://platform.twitter.com/widgets.js';
                script.async = true;
                script.charset = 'utf-8';
                script.onload = () => {
                    setTimeout(loadWidget, 100);
                };
                document.body.appendChild(script);
            } else {
                // Script exists but twttr not ready, wait for it
                const checkTwttr = setInterval(() => {
                    if (isCancelled) {
                        clearInterval(checkTwttr);
                        return;
                    }
                    if (window.twttr && window.twttr.widgets) {
                        clearInterval(checkTwttr);
                        loadWidget();
                    }
                }, 100);
                setTimeout(() => clearInterval(checkTwttr), 5000);
            }
        } else {
            setTimeout(loadWidget, 100);
        }

        // Cleanup function
        return () => {
            isCancelled = true;
        };
    }, [tweetUrl]);

    const wrapperStyle = {
        textAlign: align,
    };

    const containerStyle = {
        width: `${width}px`,
        maxWidth: '100%',
        display: 'inline-block',
    };

    return (
        <NodeViewWrapper
            className="tweet-embed-wrapper"
            data-drag-handle
            style={wrapperStyle}
        >
            <div
                ref={containerRef}
                className="relative my-4 group"
                style={containerStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => isResizing ? null : setIsHovered(false)}
            >
                {/* Hover Toolbar */}
                {selected && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[var(--bg-elevated)] border border-[var(--border-secondary)] rounded-lg shadow-lg px-2 py-1.5 flex items-center gap-1 z-10 animate-fadeIn">
                        <button
                            onClick={() => handleAlignChange('left')}
                            className={`p-1.5 rounded transition-colors ${align === 'left'
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20'
                                }`}
                            title="Align Left"
                        >
                            <AlignLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleAlignChange('center')}
                            className={`p-1.5 rounded transition-colors ${align === 'center'
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20'
                                }`}
                            title="Align Center"
                        >
                            <AlignCenter className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleAlignChange('right')}
                            className={`p-1.5 rounded transition-colors ${align === 'right'
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20'
                                }`}
                            title="Align Right"
                        >
                            <AlignRight className="w-4 h-4" />
                        </button>
                        <div className="w-px h-5 bg-[var(--border-secondary)] mx-1" />
                        <button
                            onClick={deleteNode}
                            className="p-1.5 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete Tweet"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Tweet Container with Selection Border */}
                <div
                    className={`relative rounded-xl overflow-hidden ${selected ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''
                        }`}
                >
                    {/* Loading indicator - separate from tweet container */}
                    {!isLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 z-10">
                            <span className="animate-pulse text-gray-500">Loading tweet...</span>
                        </div>
                    )}

                    {/* Tweet container - managed entirely by vanilla JS */}
                    <div
                        ref={tweetContainerRef}
                        className="tweet-content p-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[100px]"
                        suppressHydrationWarning
                    />

                    {/* Resize Handles */}
                    {(isHovered || selected || isResizing) && (
                        <>
                            {/* Left Handle */}
                            <div
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-12 bg-[var(--color-primary)] rounded-full cursor-ew-resize shadow-lg flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
                                onMouseDown={handleResizeStart}
                            >
                                <GripVertical className="w-2 h-2 text-white" />
                            </div>
                            {/* Right Handle */}
                            <div
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-12 bg-[var(--color-primary)] rounded-full cursor-ew-resize shadow-lg flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
                                onMouseDown={handleResizeStart}
                            >
                                <GripVertical className="w-2 h-2 text-white" />
                            </div>
                        </>
                    )}
                </div>

                {/* Drag Handle Indicator */}
                {(isHovered || selected) && (
                    <div
                        className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-40 hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
                        data-drag-handle
                    >
                        <GripVertical className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
}

