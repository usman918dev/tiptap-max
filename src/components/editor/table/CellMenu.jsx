'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
    MoreVertical,
    Plus,
    Minus,
    ArrowUpFromLine,
    ArrowDownFromLine,
    ArrowLeftFromLine,
    ArrowRightFromLine,
    Maximize2,
    Minimize2,
    Palette
} from 'lucide-react';
import { useState, useEffect } from 'react';

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

export default function CellMenu({ editor, getPos, onOpenChange }) {
    const [isOpen, setIsOpen] = useState(false);

    // Notify parent when dropdown opens/closes
    useEffect(() => {
        onOpenChange?.(isOpen);
    }, [isOpen, onOpenChange]);

    const canIncreaseRowspan = () => {
        const { rowspan = 1 } = editor.getAttributes('tableCell');
        // Limit to reasonable maximum
        return rowspan < 10;
    };

    const canDecreaseRowspan = () => {
        const { rowspan = 1 } = editor.getAttributes('tableCell');
        return rowspan > 1;
    };

    const canIncreaseColspan = () => {
        const { colspan = 1 } = editor.getAttributes('tableCell');
        return colspan < 10;
    };

    const canDecreaseColspan = () => {
        const { colspan = 1 } = editor.getAttributes('tableCell');
        return colspan > 1;
    };

    const setCellBackground = (color) => {
        editor.chain().focus().setCellAttribute('background', color).run();
    };

    const increaseRowspan = () => {
        if (canIncreaseRowspan()) {
            const { rowspan = 1 } = editor.getAttributes('tableCell');
            editor.chain().focus().setCellAttribute('rowspan', rowspan + 1).run();
        }
    };

    const decreaseRowspan = () => {
        if (canDecreaseRowspan()) {
            const { rowspan = 1 } = editor.getAttributes('tableCell');
            editor.chain().focus().setCellAttribute('rowspan', rowspan - 1).run();
        }
    };

    const increaseColspan = () => {
        if (canIncreaseColspan()) {
            const { colspan = 1 } = editor.getAttributes('tableCell');
            editor.chain().focus().setCellAttribute('colspan', colspan + 1).run();
        }
    };

    const decreaseColspan = () => {
        if (canDecreaseColspan()) {
            const { colspan = 1 } = editor.getAttributes('tableCell');
            editor.chain().focus().setCellAttribute('colspan', colspan - 1).run();
        }
    };

    return (
        <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    className="cell-menu-trigger"
                    onMouseDown={(e) => e.preventDefault()}
                    title="Cell options"
                >
                    <MoreVertical className="h-3.5 w-3.5" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="min-w-[220px] bg-[var(--bg-elevated)] rounded-xl shadow-lg border border-[var(--border-secondary)] p-1 z-[100]"
                    sideOffset={5}
                    align="start"
                >
                    {/* Row Operations */}
                    <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        Rows
                    </DropdownMenu.Label>

                    <DropdownMenu.Item
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] cursor-pointer outline-none transition-colors"
                        onSelect={() => editor.chain().focus().addRowBefore().run()}
                    >
                        <ArrowUpFromLine className="h-4 w-4" />
                        <span>Add Row Before</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] cursor-pointer outline-none transition-colors"
                        onSelect={() => editor.chain().focus().addRowAfter().run()}
                    >
                        <ArrowDownFromLine className="h-4 w-4" />
                        <span>Add Row After</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-500/10 cursor-pointer outline-none transition-colors"
                        onSelect={() => editor.chain().focus().deleteRow().run()}
                    >
                        <Minus className="h-4 w-4" />
                        <span>Delete Row</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-[var(--border-secondary)] my-1" />

                    {/* Column Operations */}
                    <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        Columns
                    </DropdownMenu.Label>

                    <DropdownMenu.Item
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] cursor-pointer outline-none transition-colors"
                        onSelect={() => editor.chain().focus().addColumnBefore().run()}
                    >
                        <ArrowLeftFromLine className="h-4 w-4" />
                        <span>Add Column Before</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] cursor-pointer outline-none transition-colors"
                        onSelect={() => editor.chain().focus().addColumnAfter().run()}
                    >
                        <ArrowRightFromLine className="h-4 w-4" />
                        <span>Add Column After</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-500/10 cursor-pointer outline-none transition-colors"
                        onSelect={() => editor.chain().focus().deleteColumn().run()}
                    >
                        <Minus className="h-4 w-4" />
                        <span>Delete Column</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-[var(--border-secondary)] my-1" />

                    {/* Span Operations */}
                    <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        Cell Span
                    </DropdownMenu.Label>

                    <DropdownMenu.Item
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] cursor-pointer outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--text-secondary)]"
                        onSelect={increaseRowspan}
                        disabled={!canIncreaseRowspan()}
                    >
                        <Maximize2 className="h-4 w-4" />
                        <span>Increase Rowspan</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] cursor-pointer outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--text-secondary)]"
                        onSelect={decreaseRowspan}
                        disabled={!canDecreaseRowspan()}
                    >
                        <Minimize2 className="h-4 w-4" />
                        <span>Decrease Rowspan</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] cursor-pointer outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--text-secondary)]"
                        onSelect={increaseColspan}
                        disabled={!canIncreaseColspan()}
                    >
                        <Maximize2 className="h-4 w-4 rotate-90" />
                        <span>Increase Colspan</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] cursor-pointer outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--text-secondary)]"
                        onSelect={decreaseColspan}
                        disabled={!canDecreaseColspan()}
                    >
                        <Minimize2 className="h-4 w-4 rotate-90" />
                        <span>Decrease Colspan</span>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="h-px bg-[var(--border-secondary)] my-1" />

                    {/* Background Color */}
                    <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        Background Color
                    </DropdownMenu.Label>

                    <div className="px-2 py-2">
                        <div className="grid grid-cols-5 gap-1.5">
                            {CELL_COLORS.map((color) => (
                                <button
                                    key={color.name}
                                    type="button"
                                    onClick={() => setCellBackground(color.value)}
                                    className="w-8 h-8 rounded-lg border-2 border-[var(--border-secondary)] hover:border-[var(--color-primary)] transition-all duration-200 hover:scale-110"
                                    style={{
                                        backgroundColor: color.value || 'transparent',
                                        backgroundImage: !color.value ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)' : 'none',
                                        backgroundSize: !color.value ? '8px 8px' : 'auto',
                                        backgroundPosition: !color.value ? '0 0, 4px 4px' : '0 0'
                                    }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
