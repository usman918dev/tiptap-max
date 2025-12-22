'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TableIcon, ChevronDown, Plus, Minus, Trash2 } from 'lucide-react';

export default function TableControls({ editor, isInTable }) {
    const Button = ({ onClick, children, title }) => (
        <button
            type="button"
            onClick={onClick}
            onMouseDown={(e) => e.preventDefault()}
            className="p-2 rounded-lg transition-all duration-200 text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)]"
            title={title}
        >
            {children}
        </button>
    );

    return (
        <>
            {/* Table Insert Button */}
            <Button
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                title="Insert Table (3x3)"
            >
                <TableIcon className="h-4 w-4" />
            </Button>

            {/* Table Options Dropdown (only shown when in table) */}
            {isInTable && (
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button
                            type="button"
                            className="p-2 rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors text-[var(--text-secondary)] flex items-center gap-1"
                            title="Table Options"
                        >
                            <span className="text-xs font-medium">Table</span>
                            <ChevronDown className="h-3 w-3" />
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            className="min-w-[220px] bg-[var(--bg-elevated)] rounded-xl shadow-lg border border-[var(--border-secondary)] p-1 z-50"
                            sideOffset={5}
                        >
                            <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                                onSelect={() => editor.chain().focus().addRowBefore().run()}
                            >
                                <Plus className="h-4 w-4" />
                                Add Row Before
                            </DropdownMenu.Item>

                            <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                                onSelect={() => editor.chain().focus().addRowAfter().run()}
                            >
                                <Plus className="h-4 w-4" />
                                Add Row After
                            </DropdownMenu.Item>

                            <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-500/10 cursor-pointer outline-none"
                                onSelect={() => editor.chain().focus().deleteRow().run()}
                            >
                                <Minus className="h-4 w-4" />
                                Delete Row
                            </DropdownMenu.Item>

                            <DropdownMenu.Separator className="h-px bg-[var(--border-secondary)] my-1" />

                            <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                                onSelect={() => editor.chain().focus().addColumnBefore().run()}
                            >
                                <Plus className="h-4 w-4" />
                                Add Column Before
                            </DropdownMenu.Item>

                            <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                                onSelect={() => editor.chain().focus().addColumnAfter().run()}
                            >
                                <Plus className="h-4 w-4" />
                                Add Column After
                            </DropdownMenu.Item>

                            <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-500/10 cursor-pointer outline-none"
                                onSelect={() => editor.chain().focus().deleteColumn().run()}
                            >
                                <Minus className="h-4 w-4" />
                                Delete Column
                            </DropdownMenu.Item>

                            <DropdownMenu.Separator className="h-px bg-[var(--border-secondary)] my-1" />

                            <DropdownMenu.Item
                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-500/10 cursor-pointer outline-none"
                                onSelect={() => editor.chain().focus().deleteTable().run()}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Table
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            )}
        </>
    );
}
