/**
 * Details Extension (FAQ/Collapsible)
 * Custom Tiptap extension for <details> HTML element with working collapse functionality
 */

import { Node, mergeAttributes } from '@tiptap/core';

// Details Summary (clickable header)
export const DetailsSummary = Node.create({
    name: 'detailsSummary',
    content: 'inline*',
    defining: true,

    parseHTML() {
        return [{ tag: 'summary' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['summary', mergeAttributes(HTMLAttributes, {
            class: 'details-summary cursor-pointer font-semibold py-2 px-3 hover:bg-[var(--bg-surface)] rounded transition-colors',
        }), 0];
    },
});

// Details Content (collapsible body)
export const DetailsContent = Node.create({
    name: 'detailsContent',
    content: 'block+',
    defining: true,

    parseHTML() {
        return [{ tag: 'div[data-details-content]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, {
            'data-details-content': '',
            class: 'details-content px-3 pb-3',
        }), 0];
    },
});

// Main Details Node with proper collapsing functionality
export const DetailsNode = Node.create({
    name: 'details',
    group: 'block',
    content: 'detailsSummary detailsContent',
    defining: true,

    addAttributes() {
        return {
            open: {
                default: true,
                parseHTML: (element) => element.hasAttribute('open'),
                renderHTML: (attributes) => {
                    if (attributes.open) {
                        return { open: '' };
                    }
                    return {};
                },
            },
        };
    },

    parseHTML() {
        return [{ tag: 'details' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['details', mergeAttributes(HTMLAttributes, {
            class: 'details-block my-4 border border-[var(--border-secondary)] rounded-xl overflow-hidden bg-[var(--bg-elevated)]',
        }), 0];
    },

    addNodeView() {
        return ({ node, getPos, editor }) => {
            const dom = document.createElement('details');
            dom.className = 'details-block my-4 border border-[var(--border-secondary)] rounded-xl overflow-hidden bg-[var(--bg-elevated)]';
            
            // Set initial open state
            dom.open = node.attrs.open;

            // contentDOM is where Tiptap will render child nodes (summary + content)
            // Using the details element directly as contentDOM
            const contentDOM = dom;

            // Handle toggle event to persist state
            const toggleHandler = () => {
                // Allow native toggle behavior, just sync the state
                if (typeof getPos === 'function') {
                    const pos = getPos();
                    if (pos !== undefined && pos !== null && editor && !editor.isDestroyed) {
                        try {
                            // Use setTimeout to ensure DOM has updated
                            setTimeout(() => {
                                editor.view.dispatch(
                                    editor.view.state.tr.setNodeMarkup(pos, undefined, {
                                        ...node.attrs,
                                        open: dom.open,
                                    })
                                );
                            }, 0);
                        } catch (error) {
                            console.error('Error updating details state:', error);
                        }
                    }
                }
            };

            dom.addEventListener('toggle', toggleHandler);

            return {
                dom,
                contentDOM,
                update: (updatedNode) => {
                    if (updatedNode.type.name !== 'details') {
                        return false;
                    }
                    // Sync the open state if it changed externally
                    if (dom.open !== updatedNode.attrs.open) {
                        dom.open = updatedNode.attrs.open;
                    }
                    return true;
                },
                destroy: () => {
                    // Clean up event listener
                    dom.removeEventListener('toggle', toggleHandler);
                },
            };
        };
    },

    addCommands() {
        return {
            setDetails:
                () =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: 'details',
                            attrs: { open: true },
                            content: [
                                {
                                    type: 'detailsSummary',
                                    content: [{ type: 'text', text: 'Click to expand' }],
                                },
                                {
                                    type: 'detailsContent',
                                    content: [
                                        {
                                            type: 'paragraph',
                                            content: [{ type: 'text', text: 'Add your content here...' }],
                                        },
                                    ],
                                },
                            ],
                        });
                    },
            toggleDetails:
                () =>
                    ({ state, commands }) => {
                        const { $from } = state.selection;
                        const pos = $from.before($from.depth);
                        const node = state.doc.nodeAt(pos);
                        
                        if (node && node.type.name === 'details') {
                            return commands.updateAttributes('details', {
                                open: !node.attrs.open,
                            });
                        }
                        return false;
                    },
        };
    },

    addKeyboardShortcuts() {
        return {
            'Mod-Shift-d': () => this.editor.commands.setDetails(),
        };
    },
});

export default DetailsNode;

