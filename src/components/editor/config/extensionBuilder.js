/**
 * Extension Builder
 * Builds the list of Tiptap extensions based on selected tier and drag handle toggle
 */

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Typography from '@tiptap/extension-typography';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { common, createLowlight } from 'lowlight';
import { Node } from '@tiptap/core';
import GlobalDragHandle from 'tiptap-extension-global-drag-handle';
import CustomImage from '../extensions/CustomImage';
import CustomTableCell from '../extensions/CustomTableCell';
import FontSize from '../extensions/FontSize';
import { dragHandleConfig } from '../DragHandle';

const lowlight = createLowlight(common);

// Custom HTML Block Extension
export const HtmlBlock = Node.create({
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

/**
 * Build extensions array based on tier
 * @param {string} tier - 'essentials' | 'enhanced' | 'pro'
 * @param {boolean} dragHandleEnabled - whether drag handle is enabled
 * @returns {Array} - Array of Tiptap extensions
 */
export function buildExtensions(tier, dragHandleEnabled = false) {
    // Base extensions (always included)
    const extensions = [
        StarterKit,
        Underline,
        Typography,
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: '',
            },
        }),
    ];

    // Enhanced tier adds formatting and media
    if (tier === 'enhanced' || tier === 'pro') {
        extensions.push(
            TextStyle,
            FontSize,
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
            CustomImage,
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm border border-gray-700 my-4 overflow-x-auto',
                },
            }),
        );
    }

    // Pro tier adds tables and advanced features
    if (tier === 'pro') {
        extensions.push(
            Table.configure({
                resizable: true,
                allowTableNodeSelection: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full',
                },
            }),
            TableRow,
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 px-4 py-2 bg-gray-100 font-bold text-left',
                },
            }),
            CustomTableCell.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 px-4 py-2',
                },
            }),
            HtmlBlock,
        );
    }

    // Drag handle is a separate toggle
    if (dragHandleEnabled) {
        extensions.push(GlobalDragHandle.configure(dragHandleConfig));
    }

    return extensions;
}

/**
 * Check if a toolbar feature is available for the current tier
 * @param {string} tier - Current tier
 * @param {string} feature - Feature to check
 * @returns {boolean}
 */
export function isToolbarFeatureAvailable(tier, feature) {
    const essentialsFeatures = [
        'undo', 'redo', 'bold', 'italic', 'underline',
        'headings', 'lists', 'link', 'unlink', 'quote'
    ];

    const enhancedFeatures = [
        ...essentialsFeatures,
        'alignment', 'highlight', 'subscript', 'superscript',
        'horizontalRule', 'image', 'code', 'codeBlock',
        'fontFamily', 'fontSize', 'textColor'
    ];

    const proFeatures = [
        ...enhancedFeatures,
        'table', 'htmlBlock', 'emoji'
    ];

    const featureMap = {
        essentials: essentialsFeatures,
        enhanced: enhancedFeatures,
        pro: proFeatures,
    };

    return featureMap[tier]?.includes(feature) || false;
}
