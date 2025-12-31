'use client';

import { EditorContent, useEditor } from '@tiptap/react';
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
    Palette,
    GripVertical,
    Youtube,
    Twitter,
    IndentIncrease,
    IndentDecrease,
    ChevronRight,
    Eye,
    Edit3
} from 'lucide-react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import LinkDialog from './dialog/LinkDialog';
import ImageDialog from './dialog/ImageDialog';
import HtmlDialog from './dialog/HtmlDialog';
import YoutubeDialog from './dialog/YoutubeDialog';
import TweetDialog from './dialog/TweetDialog';
import TableControls from './table/TableControls';
import TableCellMenu from './table/TableCellMenu';
import EmojiPicker from './EmojiPicker';
import ListControls from './ListControls';
import Button from '../Button';
import { useDragHandle } from './DragHandle';
import { buildExtensions, isToolbarFeatureAvailable } from './config/extensionBuilder';

const MenuBar = ({ editor, tier = 'pro', isPreview, setIsPreview }) => {
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [showHtmlDialog, setShowHtmlDialog] = useState(false);
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);
    const [showTweetDialog, setShowTweetDialog] = useState(false);
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

    const handleImageInsert = useCallback(({ url, alt, size, align, textWrap }) => {
        if (!editor) return;

        // Convert size to width value
        const sizeToWidth = {
            small: 300,
            medium: 500,
            large: 700,
            full: 800
        };

        const width = sizeToWidth[size] || 500;
        const alignValue = align || 'center';

        editor
            .chain()
            .focus()
            .setCustomImage({
                src: url,
                alt: alt || '',
                width: width,
                align: alignValue,
            })
            .run();
    }, [editor]);

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

    const handleLinkInsert = useCallback(({ url, linkText, rel }) => {
        if (!editor) return;

        // If linkText is provided and there's no selection, insert text with link
        if (linkText && editor.state.selection.empty) {
            editor
                .chain()
                .focus()
                .insertContent({
                    type: 'text',
                    text: linkText,
                    marks: [{ type: 'link', attrs: { href: url, rel: rel || null } }],
                })
                .run();
        } else {
            // Otherwise just apply link to selection
            editor
                .chain()
                .focus()
                .setLink({ href: url, rel: rel || null })
                .run();
        }
    }, [editor]);

    const removeLink = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().unsetLink().run();
    }, [editor]);

    const handleYoutubeInsert = useCallback(({ src }) => {
        if (!editor) return;
        editor.chain().focus().setYoutubeVideo({ src }).run();
    }, [editor]);

    const handleTweetInsert = useCallback(({ url }) => {
        if (!editor) return;
        editor.chain().focus().setTweetEmbed({ url }).run();
    }, [editor]);

    const insertDetails = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().setDetails().run();
    }, [editor]);

    if (!editor) {
        return null;
    }



    return (
        <div className="editor-toolbar flex flex-wrap gap-1 items-center">
            {/* Preview Toggle */}
            <Button
                onClick={() => setIsPreview(!isPreview)}
                isActive={isPreview}
                title={isPreview ? "Edit Mode" : "Preview Mode"}
            >
                {isPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            {/* Undo/Redo - Most Important */}
            <Button
                onClick={() => editor.chain().focus().undo().run()}
                title="Undo (Ctrl+Z)"
                disabled={isPreview}
            >
                <Undo className="h-4 w-4" />
            </Button>

            <Button
                onClick={() => editor.chain().focus().redo().run()}
                title="Redo (Ctrl+Y)"
            >
                <Redo className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            {/* Basic Text Formatting */}
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold (Ctrl+B)"
            >
                <Bold className="h-4 w-4" />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic (Ctrl+I)"
            >
                <Italic className="h-4 w-4" />
            </Button>

            <Button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="Underline (Ctrl+U)"
            >
                <UnderlineIcon className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            {/* Headings Dropdown */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        type="button"
                        className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1 ${editor.isActive('heading')
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

            {/* Alignment Dropdown - Enhanced+ */}
            {isToolbarFeatureAvailable(tier, 'alignment') && (
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
            )}

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            {/* Lists Dropdown */}
            <ListControls editor={editor} />

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            {/* Links - Critical for Content */}
            <Button
                onClick={() => setShowLinkDialog(true)}
                isActive={editor.isActive('link')}
                title="Insert/Edit Link (Ctrl+K)"
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

            {/* Media - Image - Enhanced+ */}
            {isToolbarFeatureAvailable(tier, 'image') && (
                <>
                    <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />
                    <Button
                        onClick={addImage}
                        title="Insert Image"
                    >
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                </>
            )}

            {/* Code Blocks - Enhanced+ */}
            {isToolbarFeatureAvailable(tier, 'code') && (
                <>
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
                </>
            )}

            <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />

            {/* Quote */}
            <Button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="Quote"
            >
                <Quote className="h-4 w-4" />
            </Button>

            {/* Indent Controls - Essentials+ */}
            {isToolbarFeatureAvailable(tier, 'indent') && (
                <>
                    <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />
                    <Button
                        onClick={() => editor.chain().focus().increaseIndent().run()}
                        title="Increase Indent (Tab)"
                    >
                        <IndentIncrease className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => editor.chain().focus().decreaseIndent().run()}
                        title="Decrease Indent (Shift+Tab)"
                    >
                        <IndentDecrease className="h-4 w-4" />
                    </Button>
                </>
            )}

            {/* Table - Pro only */}
            {isToolbarFeatureAvailable(tier, 'table') && (
                <>
                    <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />
                    <TableControls editor={editor} isInTable={isInTable} />
                </>
            )}

            {/* Additional Formatting - Enhanced+ */}
            {isToolbarFeatureAvailable(tier, 'highlight') && (
                <>
                    <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />
                    <div className="relative inline-flex items-center">
                        <Button
                            onClick={() => editor.chain().focus().toggleHighlight({ color: highlightColor }).run()}
                            isActive={editor.isActive('highlight')}
                            title="Highlight Text"
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
                </>
            )}

            {/* Details/FAQ - Enhanced+ */}
            {isToolbarFeatureAvailable(tier, 'details') && (
                <>
                    <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />
                    <Button
                        onClick={insertDetails}
                        isActive={editor.isActive('details')}
                        title="Insert FAQ / Collapsible Section"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </>
            )}

            {/* Advanced Styling - Enhanced+ */}
            {isToolbarFeatureAvailable(tier, 'fontFamily') && (
                <>
                    <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />
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
                                            editor.commands.setFontSize(size);
                                            setFontSize(size);
                                        }}
                                    >
                                        {size}
                                    </DropdownMenu.Item>
                                ))}
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>

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

                </>
            )}

            {/* HTML Block - Pro only */}
            {isToolbarFeatureAvailable(tier, 'htmlBlock') && (
                <>
                    <div className="w-px h-6 bg-[var(--border-secondary)] mx-1" />
                    <Button
                        onClick={addHtmlBlock}
                        title="Insert HTML Block"
                    >
                        <FileCode className="h-4 w-4" />
                    </Button>
                </>
            )}

            {/* YouTube Embed - Pro only */}
            {isToolbarFeatureAvailable(tier, 'youtube') && (
                <Button
                    onClick={() => setShowYoutubeDialog(true)}
                    title="Embed YouTube Video"
                >
                    <Youtube className="h-4 w-4" />
                </Button>
            )}

            {/* Tweet Embed - Pro only */}
            {isToolbarFeatureAvailable(tier, 'tweet') && (
                <Button
                    onClick={() => setShowTweetDialog(true)}
                    title="Embed Tweet"
                >
                    <Twitter className="h-4 w-4" />
                </Button>
            )}

            {/* Emoji Picker - Pro only */}
            {isToolbarFeatureAvailable(tier, 'emoji') && (
                <EmojiPicker editor={editor} />
            )}

            {/* Image Dialog */}
            <ImageDialog
                isOpen={showImageDialog}
                onClose={() => setShowImageDialog(false)}
                onInsert={handleImageInsert}
            />

            {/* HTML Block Dialog */}
            <HtmlDialog
                isOpen={showHtmlDialog}
                onClose={() => setShowHtmlDialog(false)}
                onInsert={insertHtmlBlock}
                htmlContent={htmlContent}
                setHtmlContent={setHtmlContent}
            />

            {/* Link Dialog */}
            <LinkDialog
                isOpen={showLinkDialog}
                onClose={() => setShowLinkDialog(false)}
                onInsert={handleLinkInsert}
                editor={editor}
            />

            {/* YouTube Dialog */}
            <YoutubeDialog
                isOpen={showYoutubeDialog}
                onClose={() => setShowYoutubeDialog(false)}
                onInsert={handleYoutubeInsert}
            />

            {/* Tweet Dialog */}
            <TweetDialog
                isOpen={showTweetDialog}
                onClose={() => setShowTweetDialog(false)}
                onInsert={handleTweetInsert}
            />
        </div>
    );
};

export default function BlogEditor({
    content,
    onChange,
    placeholder = "Start writing your blog post...",
    tier = 'pro',
    dragHandleEnabled = false,
}) {
    const [isPreview, setIsPreview] = useState(false);

    // Build extensions based on tier and drag handle toggle
    const extensions = useMemo(() => {
        return buildExtensions(tier, dragHandleEnabled);
    }, [tier, dragHandleEnabled]);

    const editor = useEditor({
        extensions,
        content: content || '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
        immediatelyRender: false,
    });

    // Re-create editor when tier or drag handle changes
    useEffect(() => {
        if (editor) {
            // Destroy and recreate the editor is handled by key prop in parent
        }
    }, [tier, dragHandleEnabled, editor]);

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '');
        }
    }, [content, editor]);

    // Initialize drag handle positioning
    useDragHandle(dragHandleEnabled ? editor : null);

    return (
        <div className="editor-container">
            <MenuBar editor={editor} tier={tier} isPreview={isPreview} setIsPreview={setIsPreview} />
            
            {isPreview ? (
                <div 
                    className="preview-content min-h-[300px] prose prose-invert max-w-none "
                    dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
                />
            ) : (
                <>
                    <EditorContent
                        editor={editor}
                        className="min-h-[300px]"
                        placeholder={placeholder}
                    />
                    {editor && isToolbarFeatureAvailable(tier, 'table') && <TableCellMenu editor={editor} />}
                </>
            )}
        </div>
    );
}
