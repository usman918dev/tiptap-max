'use client';

import { Extension } from '@tiptap/core';

/**
 * FontSize Extension for Tiptap
 * Allows setting font size on text using TextStyle
 */
const FontSize = Extension.create({
    name: 'fontSize',

    addOptions() {
        return {
            types: ['textStyle'],
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize?.replace(/['"]+/g, '') || null,
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setFontSize: (fontSize) => ({ commands }) => {
                return commands.setMark('textStyle', { fontSize });
            },
            unsetFontSize: () => ({ commands }) => {
                return commands.setMark('textStyle', { fontSize: null });
            },
        };
    },
});

export default FontSize;
