'use client';

import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export const tableCellMenuPluginKey = new PluginKey('tableCellMenu');

/**
 * Creates a plugin that adds a menu button to each table cell
 * The button is added as a widget decoration, not modifying the actual DOM structure
 */
export function createTableCellMenuPlugin(onButtonClick) {
    return new Plugin({
        key: tableCellMenuPluginKey,

        state: {
            init() {
                return { activeCell: null };
            },
            apply(tr, value) {
                // Check for metadata to update active cell
                const meta = tr.getMeta(tableCellMenuPluginKey);
                if (meta) {
                    return { activeCell: meta.activeCell };
                }
                return value;
            },
        },

        props: {
            decorations(state) {
                const { doc } = state;

                // Safety check
                if (!doc) {
                    return DecorationSet.empty;
                }

                const decorations = [];

                try {
                    doc.descendants((node, pos) => {
                        // Safety checks
                        if (!node || !node.type) {
                            return true; // Continue iteration
                        }

                        if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
                            // Ensure position is valid
                            if (pos < 0 || pos >= doc.content.size) {
                                return true;
                            }

                            // Create a widget decoration for the menu button
                            const button = document.createElement('button');
                            button.className = 'cell-menu-btn';
                            button.type = 'button';
                            button.title = 'Cell options';
                            button.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="1"></circle>
                                    <circle cx="12" cy="5" r="1"></circle>
                                    <circle cx="12" cy="19" r="1"></circle>
                                </svg>
                            `;

                            // Store position as data attribute for the click handler
                            button.dataset.cellPos = pos.toString();

                            button.addEventListener('mousedown', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const cellPos = parseInt(button.dataset.cellPos, 10);
                                if (onButtonClick && !isNaN(cellPos)) {
                                    onButtonClick(cellPos, node);
                                }
                            });

                            // Add decoration at the start of the cell content
                            try {
                                const decoration = Decoration.widget(pos + 1, button, {
                                    side: -1,
                                    key: `cell-menu-${pos}`,
                                });
                                decorations.push(decoration);
                            } catch (e) {
                                // Skip this decoration if position is invalid
                                console.warn('Could not create cell menu decoration', e);
                            }
                        }
                        return true; // Continue iteration
                    });
                } catch (e) {
                    console.warn('Error creating table cell menu decorations', e);
                    return DecorationSet.empty;
                }

                return DecorationSet.create(doc, decorations);
            },
        },
    });
}
