'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    Maximize2,
    Trash2,
    GripVertical
} from 'lucide-react';

export default function ImageNodeView({ node, updateAttributes, deleteNode, selected }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [caption, setCaption] = useState(node.attrs.caption || '');
    const [showCaptionInput, setShowCaptionInput] = useState(!!node.attrs.caption);
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const resizeStartX = useRef(0);
    const resizeStartWidth = useRef(0);

    const { src, alt, width, align } = node.attrs;

    useEffect(() => {
        setCaption(node.attrs.caption || '');
        setShowCaptionInput(!!node.attrs.caption);
    }, [node.attrs.caption]);

    const handleResizeStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        resizeStartX.current = e.clientX;
        resizeStartWidth.current = width;

        const handleMouseMove = (moveEvent) => {
            const delta = moveEvent.clientX - resizeStartX.current;
            const newWidth = Math.max(200, Math.min(1000, resizeStartWidth.current + delta * 2));
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

    const handleCaptionChange = (e) => {
        const newCaption = e.target.value;
        setCaption(newCaption);
        updateAttributes({ caption: newCaption });
    };

    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    };

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
            className="custom-image-wrapper"
            data-drag-handle
            style={wrapperStyle}
        >
            <div
                ref={containerRef}
                className={`relative my-4 group`}
                style={containerStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsResizing ? null : setIsHovered(false)}
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
                            onClick={() => setShowCaptionInput(!showCaptionInput)}
                            className="p-1.5 rounded text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20 transition-colors text-xs font-medium"
                            title="Toggle Caption"
                        >
                            Caption
                        </button>
                        <button
                            onClick={deleteNode}
                            className="p-1.5 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete Image"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Image Container with Selection Border */}
                <div
                    className={`relative rounded-lg overflow-hidden ${selected ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''
                        }`}
                >
                    <img
                        ref={imageRef}
                        src={src}
                        alt={alt || ''}
                        className="w-full h-auto rounded-lg shadow-md"
                        draggable={false}
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

                {/* Caption Input */}
                {showCaptionInput && (
                    <div className="mt-2">
                        <input
                            type="text"
                            value={caption}
                            onChange={handleCaptionChange}
                            placeholder="Add a caption..."
                            className="w-full px-3 py-1.5 text-sm text-center text-[var(--text-secondary)] bg-transparent border-none outline-none focus:text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                        />
                    </div>
                )}

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
