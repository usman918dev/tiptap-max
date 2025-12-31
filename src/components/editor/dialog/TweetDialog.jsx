'use client';

import { useState } from 'react';
import { Twitter, X } from 'lucide-react';

export default function TweetDialog({ isOpen, onClose, onInsert }) {
    const [tweetUrl, setTweetUrl] = useState('');
    const [error, setError] = useState('');

    const handleReset = () => {
        setTweetUrl('');
        setError('');
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    // Validate and extract Tweet ID from URL
    const extractTweetId = (url) => {
        // Match patterns like twitter.com/user/status/123 or x.com/user/status/123
        const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
        return match ? match[1] : null;
    };

    const handleInsert = () => {
        const tweetId = extractTweetId(tweetUrl);
        if (!tweetId) {
            setError('Please enter a valid Twitter/X post URL');
            return;
        }

        onInsert({ url: tweetUrl, tweetId });
        handleClose();
    };

    const tweetId = extractTweetId(tweetUrl);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-[var(--bg-elevated)] rounded-2xl max-w-lg w-full shadow-2xl border border-[var(--border-primary)]">
                <div className="bg-gradient-to-r from-sky-500 to-blue-500 px-5 py-3 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Twitter className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Embed Tweet</h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="p-5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--text-primary)]">Tweet URL *</label>
                        <input
                            type="url"
                            value={tweetUrl}
                            onChange={(e) => {
                                setTweetUrl(e.target.value);
                                setError('');
                            }}
                            placeholder="https://twitter.com/username/status/123..."
                            className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] border-2 border-[var(--border-secondary)] rounded-xl focus:border-sky-500 transition-all outline-none text-[var(--text-primary)]"
                        />
                        {error && (
                            <p className="text-xs text-red-500">{error}</p>
                        )}
                    </div>

                    {tweetId && (
                        <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl">
                            <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                                ✓ Valid tweet detected (ID: {tweetId})
                            </p>
                        </div>
                    )}

                    <p className="text-xs text-[var(--text-muted)]">
                        Paste a link to a Twitter/X post. The tweet will be embedded as an interactive widget.
                    </p>
                </div>

                <div className="px-5 py-3 bg-[var(--bg-surface)] rounded-b-2xl border-t border-[var(--border-secondary)] flex justify-end space-x-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm text-[var(--text-secondary)] bg-[var(--bg-elevated)] border-2 border-[var(--border-secondary)] rounded-lg hover:bg-[var(--bg-base)] transition-all font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        disabled={!tweetUrl}
                        className="px-4 py-2 text-sm bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Embed Tweet
                    </button>
                </div>
            </div>
        </div>
    );
}
