'use client';

/**
 * Tweet Embed Extension
 * Custom Tiptap extension for embedding Twitter/X tweets with resize support
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import TweetNodeView from './TweetNodeView';

export const TweetEmbed = Node.create({
    name: 'tweetEmbed',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            tweetUrl: {
                default: null,
            },
            tweetId: {
                default: null,
            },
            width: {
                default: 500,
            },
            align: {
                default: 'center',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-tweet-embed]',
                getAttrs: (dom) => ({
                    tweetUrl: dom.getAttribute('data-tweet-url'),
                    tweetId: dom.getAttribute('data-tweet-id'),
                    width: parseInt(dom.getAttribute('data-width')) || 500,
                    align: dom.getAttribute('data-align') || 'center',
                }),
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                'data-tweet-embed': '',
                'data-tweet-url': HTMLAttributes.tweetUrl,
                'data-tweet-id': HTMLAttributes.tweetId,
                'data-width': HTMLAttributes.width,
                'data-align': HTMLAttributes.align,
                class: 'tweet-embed-container my-4',
                style: `text-align: ${HTMLAttributes.align || 'center'}`,
            }),
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(TweetNodeView);
    },

    addCommands() {
        return {
            setTweetEmbed:
                (options) =>
                    ({ commands }) => {
                        // Extract tweet ID from URL
                        const tweetId = this.options.extractTweetId(options.url);
                        return commands.insertContent({
                            type: this.name,
                            attrs: {
                                tweetUrl: options.url,
                                tweetId: tweetId,
                                width: options.width || 500,
                                align: options.align || 'center',
                            },
                        });
                    },
        };
    },

    addOptions() {
        return {
            extractTweetId: (url) => {
                // Match patterns like twitter.com/user/status/123 or x.com/user/status/123
                const match = url?.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
                return match ? match[1] : null;
            },
        };
    },
});

export default TweetEmbed;
