'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createTableCellMenuPlugin, tableCellMenuPluginKey } from '../extensions/TableCellMenuPlugin';
import {
    ArrowUpFromLine,
    ArrowDownFromLine,
    ArrowLeftFromLine,
    ArrowRightFromLine,
    Trash2,
    Minus,
    Palette
} from 'lucide-react';

const CELL_COLORS = [
    { name: 'Default', value: '' },
    { name: 'Gray', value: '#f3f4f6' },
    { name: 'Red', value: '#fee2e2' },
    { name: 'Orange', value: '#fed7aa' },
    { name: 'Yellow', value: '#fef3c7' },
    { name: 'Green', value: '#d1fae5' },
    { name: 'Blue', value: '#dbeafe' },
    { name: 'Purple', value: '#e9d5ff' },
    { name: 'Pink', value: '#fce7f3' },
];

/**
 * Table Cell Menu - horizontal bubble menu UI that appears when clicking the 3-dot button
 * Color picker appears on hover
 */
export default function TableCellMenu({ editor }) {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [showColors, setShowColors] = useState(false);
    const menuRef = useRef(null);

    const handleButtonClick = useCallback((pos, node) => {
        // Find the clicked button
        const hoveredBtn = document.querySelector('.cell-menu-btn:hover');

        if (hoveredBtn) {
            const rect = hoveredBtn.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + 8,
                left: rect.left - 120, // Center the menu under the button
            });
        }

        // Focus the editor at this cell position
        editor.chain().focus().setTextSelection(pos + 1).run();

        setIsOpen(true);
        setShowColors(false);
    }, [editor]);

    // Register the plugin when editor is ready
    useEffect(() => {
        if (!editor) return;

        // Check if plugin is already registered
        const existingPlugin = editor.view.state.plugins.find(
            p => p.key === tableCellMenuPluginKey.key
        );

        if (!existingPlugin) {
            const plugin = createTableCellMenuPlugin(handleButtonClick);

            // Add the plugin to the editor
            const newState = editor.view.state.reconfigure({
                plugins: [...editor.view.state.plugins, plugin],
            });
            editor.view.updateState(newState);
        }
    }, [editor, handleButtonClick]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target) &&
                !e.target.classList.contains('cell-menu-btn')) {
                setIsOpen(false);
                setShowColors(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const runCommand = (command) => {
        command();
        setIsOpen(false);
        setShowColors(false);
    };

    const setCellBackground = (color) => {
        editor.chain().focus().setCellAttribute('background', color).run();
        setIsOpen(false);
        setShowColors(false);
    };

    if (!editor || !isOpen) return null;

    return (
        <div
            ref={menuRef}
            className="cell-bubble-menu"
            style={{
                position: 'fixed',
                top: menuPosition.top,
                left: menuPosition.left,
                zIndex: 100,
            }}
        >
            <div className="flex items-center gap-1 bg-[var(--bg-elevated)] border border-[var(--border-secondary)] rounded-xl p-1.5 shadow-xl">
                {/* Row Actions */}
                <button
                    type="button"
                    onClick={() => runCommand(() => editor.chain().focus().addRowBefore().run())}
                    className="bubble-action-btn"
                    title="Add Row Before"
                >
                    <ArrowUpFromLine className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => runCommand(() => editor.chain().focus().addRowAfter().run())}
                    className="bubble-action-btn"
                    title="Add Row After"
                >
                    <ArrowDownFromLine className="h-4 w-4" />
                </button>

                <div className="w-px h-5 bg-[var(--border-secondary)]" />

                {/* Column Actions */}
                <button
                    type="button"
                    onClick={() => runCommand(() => editor.chain().focus().addColumnBefore().run())}
                    className="bubble-action-btn"
                    title="Add Column Before"
                >
                    <ArrowLeftFromLine className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => runCommand(() => editor.chain().focus().addColumnAfter().run())}
                    className="bubble-action-btn"
                    title="Add Column After"
                >
                    <ArrowRightFromLine className="h-4 w-4" />
                </button>

                <div className="w-px h-5 bg-[var(--border-secondary)]" />

                {/* Delete Actions */}
                <button
                    type="button"
                    onClick={() => runCommand(() => editor.chain().focus().deleteRow().run())}
                    className="bubble-action-btn bubble-action-danger"
                    title="Delete Row"
                >
                    <Minus className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => runCommand(() => editor.chain().focus().deleteColumn().run())}
                    className="bubble-action-btn bubble-action-danger"
                    title="Delete Column"
                >
                    <Minus className="h-4 w-4 rotate-90" />
                </button>

                <button
                    type="button"
                    onClick={() => runCommand(() => editor.chain().focus().deleteTable().run())}
                    className="bubble-action-btn bubble-action-danger"
                    title="Delete Table"
                >
                    <Trash2 className="h-4 w-4" />
                </button>

                <div className="w-px h-5 bg-[var(--border-secondary)]" />

                {/* Color Picker - Click Toggle Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        className={`bubble-action-btn ${showColors ? 'bg-[var(--bg-secondary)]' : ''}`}
                        title="Cell Background Color"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowColors(!showColors);
                        }}
                    >
                        <Palette className="h-4 w-4" />
                    </button>

                    {/* Color Dropdown on Hover */}
                    {showColors && (
                        <div className="absolute top-full right-0 mt-2 p-3 bg-[var(--bg-elevated)] border border-[var(--border-secondary)] rounded-xl shadow-xl min-w-[160px]">
                            <div className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase">Cell Color</div>
                            <div className="grid grid-cols-5 gap-2">
                                {CELL_COLORS.map((color) => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => setCellBackground(color.value)}
                                        className="w-7 h-7 rounded-lg border-2 border-[var(--border-secondary)] hover:border-[var(--color-primary)] transition-all duration-200 hover:scale-110"
                                        style={{
                                            backgroundColor: color.value || 'transparent',
                                            backgroundImage: !color.value ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)' : 'none',
                                            backgroundSize: !color.value ? '6px 6px' : 'auto',
                                            backgroundPosition: !color.value ? '0 0, 3px 3px' : '0 0'
                                        }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
