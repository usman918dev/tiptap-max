/**
 * Space Indent Extension
 * Custom Tiptap extension for paragraph indentation using Tab/Shift+Tab
 */

import { Extension } from '@tiptap/core';

export const SpaceIndent = Extension.create({
    name: 'spaceIndent',

    addOptions() {
        return {
            types: ['paragraph', 'heading'],
            indentLevels: [0, 40, 80, 120, 160], // pixels
            defaultIndentLevel: 0,
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    indent: {
                        default: 0,
                        parseHTML: (element) => {
                            const marginLeft = element.style.marginLeft;
                            if (marginLeft) {
                                const value = parseInt(marginLeft, 10);
                                return this.options.indentLevels.indexOf(value) !== -1
                                    ? value
                                    : this.options.defaultIndentLevel;
                            }
                            return this.options.defaultIndentLevel;
                        },
                        renderHTML: (attributes) => {
                            if (!attributes.indent || attributes.indent === 0) {
                                return {};
                            }
                            return {
                                style: `margin-left: ${attributes.indent}px`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            increaseIndent:
                () =>
                    ({ tr, state, dispatch }) => {
                        const { selection } = state;
                        const { from, to } = selection;

                        state.doc.nodesBetween(from, to, (node, pos) => {
                            if (this.options.types.includes(node.type.name)) {
                                const currentIndent = node.attrs.indent || 0;
                                const currentIndex = this.options.indentLevels.indexOf(currentIndent);
                                const nextIndex = Math.min(
                                    currentIndex + 1,
                                    this.options.indentLevels.length - 1
                                );
                                const newIndent = this.options.indentLevels[nextIndex];

                                if (dispatch) {
                                    tr.setNodeMarkup(pos, undefined, {
                                        ...node.attrs,
                                        indent: newIndent,
                                    });
                                }
                            }
                        });

                        if (dispatch) {
                            dispatch(tr);
                        }

                        return true;
                    },

            decreaseIndent:
                () =>
                    ({ tr, state, dispatch }) => {
                        const { selection } = state;
                        const { from, to } = selection;

                        state.doc.nodesBetween(from, to, (node, pos) => {
                            if (this.options.types.includes(node.type.name)) {
                                const currentIndent = node.attrs.indent || 0;
                                const currentIndex = this.options.indentLevels.indexOf(currentIndent);
                                const prevIndex = Math.max(currentIndex - 1, 0);
                                const newIndent = this.options.indentLevels[prevIndex];

                                if (dispatch) {
                                    tr.setNodeMarkup(pos, undefined, {
                                        ...node.attrs,
                                        indent: newIndent,
                                    });
                                }
                            }
                        });

                        if (dispatch) {
                            dispatch(tr);
                        }

                        return true;
                    },
        };
    },

    addKeyboardShortcuts() {
        return {
            Tab: () => this.editor.commands.increaseIndent(),
            'Shift-Tab': () => this.editor.commands.decreaseIndent(),
        };
    },
});

export default SpaceIndent;
