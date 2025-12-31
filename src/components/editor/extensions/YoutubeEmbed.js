'use client';

/**
 * YouTube Embed Extension
 * Custom Tiptap extension for embedding YouTube videos with resize support
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import YoutubeNodeView from './YoutubeNodeView';

// Helper to extract video ID from various YouTube URL formats
const getYoutubeId = (url) => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url?.match(pattern);
        if (match) return match[1];
    }
    return null;
};

export const YoutubeEmbed = Node.create({
    name: 'youtube',
    group: 'block',
    atom: true,
    draggable: true,

    addOptions() {
        return {
            inline: false,
            width: 640,
            controls: true,
            nocookie: true,
            allowFullscreen: true,
            HTMLAttributes: {
                class: 'youtube-embed my-4',
            },
        };
    },

    addAttributes() {
        return {
            src: {
                default: null,
            },
            width: {
                default: 640,
            },
            align: {
                default: 'center',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-youtube-video]',
                getAttrs: (dom) => ({
                    src: dom.getAttribute('data-src'),
                    width: parseInt(dom.getAttribute('data-width')) || 640,
                    align: dom.getAttribute('data-align') || 'center',
                }),
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const videoId = getYoutubeId(HTMLAttributes.src || '');
        const width = HTMLAttributes.width || 640;
        const height = Math.round(width * 9 / 16);

        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, {
                'data-youtube-video': '',
                'data-src': HTMLAttributes.src,
                'data-width': HTMLAttributes.width,
                'data-align': HTMLAttributes.align,
                style: `text-align: ${HTMLAttributes.align || 'center'}`,
            }),
            [
                'iframe',
                {
                    src: videoId
                        ? `https://www.youtube${this.options.nocookie ? '-nocookie' : ''}.com/embed/${videoId}${this.options.controls ? '?controls=1' : '?controls=0'}`
                        : '',
                    width: width,
                    height: height,
                    frameborder: '0',
                    allowfullscreen: this.options.allowFullscreen ? 'allowfullscreen' : '',
                    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                    style: 'border-radius: 12px; max-width: 100%;',
                },
            ],
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(YoutubeNodeView);
    },

    addCommands() {
        return {
            setYoutubeVideo:
                (options) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: {
                                src: options.src,
                                width: options.width || 640,
                                align: options.align || 'center',
                            },
                        });
                    },
        };
    },
});

export default YoutubeEmbed;
