'use client';

import { TableCell } from '@tiptap/extension-table-cell';

/**
 * Custom TableCell extension with background color support
 * 
 * Note: We removed ReactNodeViewRenderer as it was breaking table layout.
 * The cell menu can be added back using a BubbleMenu or plugin approach.
 */
export const CustomTableCell = TableCell.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            background: {
                default: null,
                parseHTML: element => element.getAttribute('data-background') || element.style.backgroundColor,
                renderHTML: attributes => {
                    if (!attributes.background) {
                        return {};
                    }
                    return {
                        'data-background': attributes.background,
                        style: `background-color: ${attributes.background}`,
                    };
                },
            },
        };
    },
});

export default CustomTableCell;
