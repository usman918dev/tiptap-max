'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { common, createLowlight } from 'lowlight';
import { Node } from '@tiptap/core';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Heading1,
    Heading2,
    Heading3,
    Code,
    Code2,
    Link as LinkIcon,
    Unlink,
    Image as ImageIcon,
    Upload,
    Table as TableIcon,
    Plus,
    Minus,
    Trash2,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Highlighter,
    MinusIcon,
    Subscript as SubscriptIcon,
    Superscript as SuperscriptIcon,
    ChevronDown,
    FileCode,
    X,
    Type,
    Palette
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const lowlight = createLowlight(common);

// Custom HTML Block Extension
const HtmlBlock = Node.create({
    name: 'htmlBlock',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            htmlContent: { default: '' },
            dataLevel: { default: null },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-html-block]',
                getAttrs: (dom) => ({
                    htmlContent: dom.innerHTML,
                    dataLevel: dom.getAttribute('data-level'),
                }),
            },
        ];
    },

    renderHTML({ node }) {
        return [
            'div',
            {
                'data-html-block': '',
                'data-level': node.attrs.dataLevel,
                class: 'html-block-content my-4',
            },
        ];
    },

    addNodeView() {
        return ({ node }) => {
            const dom = document.createElement('div');
            dom.className = 'html-block-content my-4';
            dom.setAttribute('data-html-block', '');
            dom.setAttribute('data-level', node.attrs.dataLevel || '1');
            dom.innerHTML = node.attrs.htmlContent;
            return { dom };
        };
    },

    addCommands() {
        return {
            setHtmlBlock:
                (attributes) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: attributes,
                        });
                    },
        };
    },
});

const MenuBar = ({ editor }) => {
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [showHtmlDialog, setShowHtmlDialog] = useState(false);
    const [linkFollow, setLinkFollow] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');
    const [isInTable, setIsInTable] = useState(false);
    const [highlightColor, setHighlightColor] = useState('#fef08a');
    const [textColor, setTextColor] = useState('#000000');
    const [fontSize, setFontSize] = useState('16px');
    const [fontFamily, setFontFamily] = useState('Inter');

    const fontFamilies = [
        'Inter',
        'Arial',
        'Helvetica',
        'Times New Roman',
        'Georgia',
        'Courier New',
        'Verdana',
        'Comic Sans MS',
        'Impact',
    ];

    const fontSizes = [
        '12px',
        '14px',
        '16px',
        '18px',
        '20px',
        '24px',
        '28px',
        '32px',
        '36px',
        '48px',
    ];

    useEffect(() => {
        if (!editor) return;

        const updateTableState = () => {
            setIsInTable(editor.isActive('table'));
        };

        editor.on('selectionUpdate', updateTableState);
        editor.on('transaction', updateTableState);

        return () => {
            editor.off('selectionUpdate', updateTableState);
            editor.off('transaction', updateTableState);
        };
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;
        setShowImageDialog(true);
    }, [editor]);

    const addHtmlBlock = useCallback(() => {
        if (!editor) return;
        setShowHtmlDialog(true);
    }, [editor]);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        setIsImageUploading(true);

        try {
            const result = await uploadToCloudinary(file, 'blog-images');

            if (!result.success) {
                alert(result.error || 'Failed to upload image. Please try again.');
                return;
            }

            setImageUrl(result.url);
        } catch (err) {
            alert('Failed to upload image. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setIsImageUploading(false);
        }
    };

    const insertImage = useCallback(() => {
        if (!editor || !imageUrl || !imageAlt) return;

        editor
            .chain()
            .focus()
            .setImage({
                src: imageUrl,
                alt: imageAlt,
            })
            .run();

        setShowImageDialog(false);
        setImageUrl('');
        setImageAlt('');
    }, [editor, imageUrl, imageAlt]);

    const insertHtmlBlock = useCallback(() => {
        if (!editor || !htmlContent) return;

        editor
            .chain()
            .focus()
            .setHtmlBlock({
                htmlContent: htmlContent,
                dataLevel: 1,
            })
            .run();

        setShowHtmlDialog(false);
        setHtmlContent('');
    }, [editor, htmlContent]);

    const addLink = useCallback(() => {
        if (!editor) return;

        const url = window.prompt('Enter URL:');
        if (url) {
            const rel = linkFollow ? '' : 'nofollow';
            editor.chain().focus().setLink({ href: url, rel }).run();
        }
    }, [editor, linkFollow]);

    const removeLink = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().unsetLink().run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    const Button = ({ onClick, isActive, children, title, disabled = false }) => (
        <button
            type="button"
            onClick={onClick}
            onMouseDown={(e) => e.preventDefault()}
            disabled={disabled}
            className={`p-2 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-lg'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)]'
                } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            title={title}
        >
            {children}
        </button>
    );

    return (
        <div className="editor-toolbar flex flex-wrap gap-1 items-center">
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="Underline"
            >
                <UnderlineIcon className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            <Button
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive('code')}
                title="Inline Code"
            >
                <Code className="h-4 w-4" />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive('codeBlock')}
                title="Code Block"
            >
                <Code2 className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            {/* Font Family Dropdown */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        type="button"
                        className="p-2 px-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] transition-all duration-200 flex items-center gap-1"
                        title="Font Family"
                    >
                        <Type className="h-4 w-4" />
                        <ChevronDown className="h-3 w-3" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[180px] bg-[var(--bg-elevated)] rounded-xl shadow-lg border border-[var(--border-secondary)] p-1 z-50 max-h-[300px] overflow-y-auto"
                        sideOffset={5}
                    >
                        {fontFamilies.map((font) => (
                            <DropdownMenu.Item
                                key={font}
                                className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                                onSelect={() => {
                                    editor.chain().focus().setFontFamily(font).run();
                                    setFontFamily(font);
                                }}
                                style={{ fontFamily: font }}
                            >
                                {font}
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Font Size Dropdown */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        type="button"
                        className="p-2 px-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] transition-all duration-200 flex items-center gap-1 text-xs font-medium"
                        title="Font Size"
                    >
                        {fontSize}
                        <ChevronDown className="h-3 w-3" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[120px] bg-[var(--bg-elevated)] rounded-xl shadow-lg border border-[var(--border-secondary)] p-1 z-50 max-h-[300px] overflow-y-auto"
                        sideOffset={5}
                    >
                        {fontSizes.map((size) => (
                            <DropdownMenu.Item
                                key={size}
                                className="flex items-center justify-center px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                                onSelect={() => {
                                    editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
                                    setFontSize(size);
                                }}
                            >
                                {size}
                            </DropdownMenu.Item>
                        ))}
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Text Color Picker */}
            <div className="relative inline-flex items-center">
                <Button
                    onClick={() => editor.chain().focus().setColor(textColor).run()}
                    title="Text Color"
                >
                    <Palette className="h-4 w-4" />
                </Button>
                <input
                    type="color"
                    value={textColor}
                    onChange={(e) => {
                        setTextColor(e.target.value);
                        editor.chain().focus().setColor(e.target.value).run();
                    }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-[var(--border-secondary)] cursor-pointer"
                    title="Choose Text Color"
                />
            </div>

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            {/* Headings Dropdown */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        type="button"
                        className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1 ${
                            editor.isActive('heading')
                                ? 'bg-[var(--color-primary)] text-white shadow-lg'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)]'
                        }`}
                        title="Headings"
                    >
                        {editor.isActive('heading', { level: 1 }) ? (
                            <Heading1 className="h-4 w-4" />
                        ) : editor.isActive('heading', { level: 2 }) ? (
                            <Heading2 className="h-4 w-4" />
                        ) : editor.isActive('heading', { level: 3 }) ? (
                            <Heading3 className="h-4 w-4" />
                        ) : (
                            <Heading1 className="h-4 w-4" />
                        )}
                        <ChevronDown className="h-3 w-3" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[180px] bg-[var(--bg-elevated)] rounded-xl shadow-lg border border-[var(--border-secondary)] p-1 z-50"
                        sideOffset={5}
                    >
                        <DropdownMenu.Item
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                            onSelect={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        >
                            <Heading1 className="h-4 w-4" />
                            Heading 1
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                            onSelect={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        >
                            <Heading2 className="h-4 w-4" />
                            Heading 2
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                            onSelect={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        >
                            <Heading3 className="h-4 w-4" />
                            Heading 3
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            {/* Alignment Dropdown */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        type="button"
                        className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] transition-all duration-200 flex items-center gap-1"
                        title="Text Alignment"
                    >
                        {editor.isActive({ textAlign: 'center' }) ? (
                            <AlignCenter className="h-4 w-4" />
                        ) : editor.isActive({ textAlign: 'right' }) ? (
                            <AlignRight className="h-4 w-4" />
                        ) : editor.isActive({ textAlign: 'justify' }) ? (
                            <AlignJustify className="h-4 w-4" />
                        ) : (
                            <AlignLeft className="h-4 w-4" />
                        )}
                        <ChevronDown className="h-3 w-3" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[160px] bg-[var(--bg-elevated)] rounded-xl shadow-lg border border-[var(--border-secondary)] p-1 z-50"
                        sideOffset={5}
                    >
                        <DropdownMenu.Item
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                            onSelect={() => editor.chain().focus().setTextAlign('left').run()}
                        >
                            <AlignLeft className="h-4 w-4" />
                            Align Left
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                            onSelect={() => editor.chain().focus().setTextAlign('center').run()}
                        >
                            <AlignCenter className="h-4 w-4" />
                            Align Center
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                            onSelect={() => editor.chain().focus().setTextAlign('right').run()}
                        >
                            <AlignRight className="h-4 w-4" />
                            Align Right
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                            onSelect={() => editor.chain().focus().setTextAlign('justify').run()}
                        >
                            <AlignJustify className="h-4 w-4" />
                            Justify
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            {/* Lists Dropdown */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        type="button"
                        className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1 ${
                            editor.isActive('bulletList') || editor.isActive('orderedList')
                                ? 'bg-[var(--color-primary)] text-white shadow-lg'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)]'
                        }`}
                        title="Lists"
                    >
                        {editor.isActive('orderedList') ? (
                            <ListOrdered className="h-4 w-4" />
                        ) : (
                            <List className="h-4 w-4" />
                        )}
                        <ChevronDown className="h-3 w-3" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[160px] bg-[var(--bg-elevated)] rounded-xl shadow-lg border border-[var(--border-secondary)] p-1 z-50"
                        sideOffset={5}
                    >
                        <DropdownMenu.Item
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                            onSelect={() => editor.chain().focus().toggleBulletList().run()}
                        >
                            <List className="h-4 w-4" />
                            Bullet List
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                            className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-[var(--color-primary)]/20 cursor-pointer outline-none"
                            onSelect={() => editor.chain().focus().toggleOrderedList().run()}
                        >
                            <ListOrdered className="h-4 w-4" />
                            Ordered List
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <Button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="Quote"
            >
                <Quote className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            <div className="relative inline-flex items-center">
                <Button
                    onClick={() => editor.chain().focus().toggleHighlight({ color: highlightColor }).run()}
                    isActive={editor.isActive('highlight')}
                    title="Highlight"
                >
                    <Highlighter className="h-4 w-4" />
                </Button>
                <input
                    type="color"
                    value={highlightColor}
                    onChange={(e) => setHighlightColor(e.target.value)}
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-[var(--border-secondary)] cursor-pointer"
                    title="Highlight Color"
                />
            </div>

            <Button
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                isActive={editor.isActive('subscript')}
                title="Subscript"
            >
                <SubscriptIcon className="h-4 w-4" />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                isActive={editor.isActive('superscript')}
                title="Superscript"
            >
                <SuperscriptIcon className="h-4 w-4" />
            </Button>

            <Button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
            >
                <MinusIcon className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            <Button
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                title="Insert Table (3x3)"
            >
                <TableIcon className="h-4 w-4" />
            </Button>

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

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            <Button
                onClick={addLink}
                isActive={editor.isActive('link')}
                title="Add Link"
            >
                <LinkIcon className="h-4 w-4" />
            </Button>

            <Button
                onClick={removeLink}
                disabled={!editor.isActive('link')}
                title="Remove Link"
            >
                <Unlink className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            <Button
                onClick={addImage}
                title="Insert Image"
            >
                <ImageIcon className="h-4 w-4" />
            </Button>

            <Button
                onClick={addHtmlBlock}
                title="Insert HTML Block"
            >
                <FileCode className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-1 px-2 py-1 bg-[var(--bg-surface)] rounded-lg text-xs ml-2">
                <input
                    type="checkbox"
                    id="linkFollow"
                    checked={linkFollow}
                    onChange={(e) => setLinkFollow(e.target.checked)}
                    className="w-3 h-3 accent-[var(--color-primary)]"
                />
                <label htmlFor="linkFollow" className="text-[var(--text-muted)]">
                    Follow
                </label>
            </div>

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            <Button
                onClick={() => editor.chain().focus().undo().run()}
                title="Undo"
            >
                <Undo className="h-4 w-4" />
            </Button>

            <Button
                onClick={() => editor.chain().focus().redo().run()}
                title="Redo"
            >
                <Redo className="h-4 w-4" />
            </Button>

            {/* Image Upload Dialog */}
            {showImageDialog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-[var(--bg-elevated)] rounded-2xl max-w-lg w-full shadow-2xl border border-[var(--border-primary)]">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <ImageIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Insert Image</h3>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowImageDialog(false);
                                        setImageUrl('');
                                        setImageAlt('');
                                    }}
                                    className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-primary)]">Choose Image *</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isImageUploading}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex items-center justify-center w-full p-6 border-2 border-dashed border-[var(--border-secondary)] rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-500/10 transition-all group"
                                    >
                                        <div className="text-center">
                                            {isImageUploading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                                                    <span className="text-green-500 font-medium">Uploading...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="h-8 w-8 text-[var(--text-muted)] group-hover:text-green-500 mx-auto mb-2" />
                                                    <p className="text-sm text-[var(--text-secondary)]">Click to upload or drag and drop</p>
                                                    <p className="text-xs text-[var(--text-muted)] mt-1">PNG, JPG, GIF up to 5MB</p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[var(--border-secondary)]" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[var(--bg-elevated)] text-[var(--text-muted)]">or enter URL</span>
                                </div>
                            </div>

                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-3 bg-[var(--bg-surface)] border-2 border-[var(--border-secondary)] rounded-xl focus:border-green-500 transition-all outline-none text-[var(--text-primary)]"
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-primary)]">Alt Text (Accessibility) *</label>
                                <input
                                    type="text"
                                    value={imageAlt}
                                    onChange={(e) => setImageAlt(e.target.value)}
                                    placeholder="Describe the image"
                                    className="w-full px-4 py-3 bg-[var(--bg-surface)] border-2 border-[var(--border-secondary)] rounded-xl focus:border-green-500 transition-all outline-none text-[var(--text-primary)]"
                                />
                            </div>

                            {imageUrl && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-primary)]">Preview</label>
                                    <div className="border-2 border-[var(--border-secondary)] rounded-xl p-4">
                                        <img
                                            src={imageUrl}
                                            alt={imageAlt || 'Preview'}
                                            className="max-w-full h-auto rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-[var(--bg-surface)] rounded-b-2xl border-t border-[var(--border-secondary)] flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowImageDialog(false);
                                    setImageUrl('');
                                    setImageAlt('');
                                }}
                                className="px-5 py-2.5 text-[var(--text-secondary)] bg-[var(--bg-elevated)] border-2 border-[var(--border-secondary)] rounded-lg hover:bg-[var(--bg-base)] transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={insertImage}
                                disabled={!imageUrl || !imageAlt || isImageUploading}
                                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Insert Image
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HTML Block Dialog */}
            {showHtmlDialog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-[var(--bg-elevated)] rounded-2xl max-w-2xl w-full shadow-2xl border border-[var(--border-primary)]">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <FileCode className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Insert HTML Block</h3>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowHtmlDialog(false);
                                        setHtmlContent('');
                                    }}
                                    className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-primary)]">HTML Content *</label>
                                <textarea
                                    value={htmlContent}
                                    onChange={(e) => setHtmlContent(e.target.value)}
                                    placeholder="<div>Your HTML content here...</div>"
                                    rows={10}
                                    className="w-full px-4 py-3 bg-[var(--bg-surface)] border-2 border-[var(--border-secondary)] rounded-xl focus:border-purple-500 transition-all outline-none text-[var(--text-primary)] font-mono text-sm"
                                />
                            </div>

                            {htmlContent && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-primary)]">Preview</label>
                                    <div className="border-2 border-purple-500/30 rounded-xl p-4 bg-purple-500/5">
                                        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-[var(--bg-surface)] rounded-b-2xl border-t border-[var(--border-secondary)] flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowHtmlDialog(false);
                                    setHtmlContent('');
                                }}
                                className="px-5 py-2.5 text-[var(--text-secondary)] bg-[var(--bg-elevated)] border-2 border-[var(--border-secondary)] rounded-lg hover:bg-[var(--bg-base)] transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={insertHtmlBlock}
                                disabled={!htmlContent}
                                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Insert HTML
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function BlogEditor({ content, onChange, placeholder = "Start writing your blog post..." }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Typography,
            TextStyle,
            Color,
            FontFamily,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            Subscript,
            Superscript,
            HorizontalRule,
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg shadow-md my-4',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: '',
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm border border-gray-700 my-4 overflow-x-auto',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full my-4',
                },
            }),
            TableRow,
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 px-4 py-2 bg-gray-100 font-bold text-left',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 px-4 py-2',
                },
            }),
            HtmlBlock,
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '');
        }
    }, [content, editor]);

    return (
        <div className="editor-container">
            <MenuBar editor={editor} />
            <EditorContent
                editor={editor}
                className="min-h-[300px]"
                placeholder={placeholder}
            />
        </div>
    );
}
