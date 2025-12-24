'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
    List,
    ListOrdered,
    ChevronDown
} from 'lucide-react';

/**
 * ListControls - Handles bullet and ordered lists
 */
export default function ListControls({ editor }) {
    if (!editor) return null;

    const isAnyListActive = editor.isActive('bulletList') ||
        editor.isActive('orderedList');

    const getCurrentListIcon = () => {
        if (editor.isActive('orderedList')) {
            return <ListOrdered className="h-4 w-4" />;
        }
        return <List className="h-4 w-4" />;
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1 ${isAnyListActive
                        ? 'bg-[var(--color-primary)] text-white shadow-lg'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)]'
                        }`}
                    title="Lists"
                >
                    {getCurrentListIcon()}
                    <ChevronDown className="h-3 w-3" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="min-w-[180px] bg-[var(--bg-elevated)] rounded-xl shadow-lg border border-[var(--border-secondary)] p-1 z-50"
                    sideOffset={5}
                >
                    <DropdownMenu.Item
                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer outline-none ${editor.isActive('bulletList')
                            ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20'
                            }`}
                        onSelect={() => editor.chain().focus().toggleBulletList().run()}
                    >
                        <List className="h-4 w-4" />
                        Bullet List
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer outline-none ${editor.isActive('orderedList')
                            ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20'
                            }`}
                        onSelect={() => editor.chain().focus().toggleOrderedList().run()}
                    >
                        <ListOrdered className="h-4 w-4" />
                        Numbered List
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
