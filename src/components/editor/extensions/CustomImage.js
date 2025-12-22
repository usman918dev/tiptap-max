'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ImageNodeView from './ImageNodeView';

/**
 * Custom Image Extension with Notion-like features:
 * - Interactive resize handles
 * - Hover toolbar with alignment options
 * - Caption support
 * - Drag handles
 */
export const CustomImage = Node.create({
    name: 'customImage',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
            width: {
                default: 500,
            },
            align: {
                default: 'center',
            },
            caption: {
                default: '',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-custom-image]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-custom-image': '' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageNodeView);
    },

    addCommands() {
        return {
            setCustomImage:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options,
                    });
                },
            updateCustomImage:
                (attrs) =>
                ({ commands, state }) => {
                    const { selection } = state;
                    return commands.updateAttributes(this.name, attrs);
                },
        };
    },
});

export default CustomImage;
