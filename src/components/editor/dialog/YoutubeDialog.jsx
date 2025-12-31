'use client';

import { useState } from 'react';
import { Youtube, X } from 'lucide-react';

export default function YoutubeDialog({ isOpen, onClose, onInsert }) {
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [error, setError] = useState('');

    const handleReset = () => {
        setYoutubeUrl('');
        setError('');
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    // Validate and extract YouTube video ID
    const extractVideoId = (url) => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    const handleInsert = () => {
        const videoId = extractVideoId(youtubeUrl);
        if (!videoId) {
            setError('Please enter a valid YouTube URL');
            return;
        }

        onInsert({ src: youtubeUrl });
        handleClose();
    };

    const videoId = extractVideoId(youtubeUrl);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-[var(--bg-elevated)] rounded-2xl max-w-lg w-full shadow-2xl border border-[var(--border-primary)]">
                <div className="bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Youtube className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Embed YouTube Video</h3>
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
                        <label className="text-xs font-semibold text-[var(--text-primary)]">YouTube URL *</label>
                        <input
                            type="url"
                            value={youtubeUrl}
                            onChange={(e) => {
                                setYoutubeUrl(e.target.value);
                                setError('');
                            }}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] border-2 border-[var(--border-secondary)] rounded-xl focus:border-red-500 transition-all outline-none text-[var(--text-primary)]"
                        />
                        {error && (
                            <p className="text-xs text-red-500">{error}</p>
                        )}
                    </div>

                    {videoId && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--text-primary)]">Preview</label>
                            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}

                    <p className="text-xs text-[var(--text-muted)]">
                        Supported formats: youtube.com/watch, youtu.be, youtube.com/shorts
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
                        disabled={!youtubeUrl}
                        className="px-4 py-2 text-sm bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Embed Video
                    </button>
                </div>
            </div>
        </div>
    );
}
