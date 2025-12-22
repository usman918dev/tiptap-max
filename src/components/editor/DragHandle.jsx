'use client';

import { useEffect } from 'react';

/**
 * DragHandle component that manages the positioning of the drag handle
 * to keep it aligned at a fixed left position regardless of content indentation
 */
export function useDragHandle(editor) {
    useEffect(() => {
        if (!editor) return;

        // Override drag handle positioning to keep it aligned
        const observer = new MutationObserver(() => {
            const dragHandle = document.querySelector('.drag-handle');
            if (dragHandle && !dragHandle.classList.contains('hide')) {
                const editorContainer = document.querySelector('.editor-container');
                if (editorContainer) {
                    const containerRect = editorContainer.getBoundingClientRect();
                    const currentTop = dragHandle.style.top;
                    // Keep left position fixed relative to editor container
                    dragHandle.style.left = `${containerRect.left + 8}px`;
                    dragHandle.style.top = currentTop; // Keep the top position calculated by the extension
                }
            }
        });

        // Watch for style changes on drag handle
        const dragHandle = document.querySelector('.drag-handle');
        if (dragHandle) {
            observer.observe(dragHandle, {
                attributes: true,
                attributeFilter: ['style', 'class'],
            });
        }

        // Also observe for when drag handle is added to DOM
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
        };
    }, [editor]);
}

/**
 * Configuration for GlobalDragHandle extension
 */
export const dragHandleConfig = {
    dragHandleWidth: 24,
    scrollTreshold: 100,
    excludedTags: ['li', 'td', 'th', 'tr', 'tbody', 'thead'],
};
