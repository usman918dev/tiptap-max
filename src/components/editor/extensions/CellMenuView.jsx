'use client';

import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';
import CellMenu from '../table/CellMenu';

/**
 * React NodeView for table cells with floating menu trigger
 * Displays a three-dot menu button on hover/focus
 * 
 * Note: Using default NodeViewWrapper (renders as span) to avoid hydration errors.
 * The actual <td> structure is managed by Tiptap's table extension.
 */
export default function CellMenuView({ node, getPos, editor }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleFocusWithin = () => {
            if (wrapperRef.current) {
                const hasFocus = wrapperRef.current.contains(document.activeElement);
                setIsFocused(hasFocus);
            }
        };

        // Check focus on mount and when editor selection changes
        handleFocusWithin();

        const interval = setInterval(handleFocusWithin, 100);
        return () => clearInterval(interval);
    }, [editor]);

    // Show menu when hovered, focused, OR when dropdown is open
    const showMenu = isHovered || isFocused || isMenuOpen;
    const background = node.attrs.background;

    return (
        <NodeViewWrapper
            ref={wrapperRef}
            className="table-cell-content-wrapper"
            data-cell-menu={showMenu ? 'visible' : 'hidden'}
            style={{
                display: 'block',
                backgroundColor: background || undefined,
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {showMenu && (
                <span className="cell-menu-container">
                    <CellMenu
                        editor={editor}
                        getPos={getPos}
                        onOpenChange={setIsMenuOpen}
                    />
                </span>
            )}
            <NodeViewContent className="cell-content" />
        </NodeViewWrapper>
    );
}
