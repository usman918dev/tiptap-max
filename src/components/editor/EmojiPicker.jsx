'use client';

import { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';

// Common emojis organized by category
const EMOJI_CATEGORIES = {
    'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😋', '😜', '🤪', '😎', '🤩', '🥳'],
    'Gestures': ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '👏', '🙌', '👐', '🤝', '🙏', '✍️', '💪', '🦾', '🖐️', '👋', '🤚', '✋', '👆'],
    'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'],
    'Stars': ['⭐', '🌟', '✨', '💫', '⚡', '🔥', '💥', '☀️', '🌙', '🌈', '☁️', '❄️', '💧', '🌊', '🎯', '🏆', '🎉', '🎊', '🎁', '🎈'],
    'Objects': ['💡', '📌', '📍', '✏️', '📝', '📂', '📁', '📅', '📆', '🔔', '🔕', '📣', '💬', '💭', '🗨️', '📧', '✉️', '📩', '📨', '📤'],
    'Symbols': ['✅', '❌', '⭕', '❗', '❓', '‼️', '⁉️', '💯', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '▶️', '⏸️', '⏹️'],
    'Arrows': ['➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '🔄', '🔃', '🔙', '🔚', '🔛', '🔜', '🔝', '⤴️', '⤵️', '🔀'],
};

export default function EmojiPicker({ editor }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Smileys');
    const pickerRef = useRef(null);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const insertEmoji = (emoji) => {
        if (editor) {
            editor.chain().focus().insertContent(emoji).run();
        }
        setIsOpen(false);
    };

    return (
        <div ref={pickerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onMouseDown={(e) => e.preventDefault()}
                className="p-2 rounded-lg transition-all duration-200 text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)]"
                title="Insert Emoji"
            >
                <Smile className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="absolute top-full -left-72 mt-2 bg-[var(--bg-elevated)] border border-[var(--border-secondary)] rounded-xl shadow-xl z-50 w-[320px]">
                    {/* Category tabs */}
                    <div className="flex gap-1 p-2 border-b border-[var(--border-secondary)] overflow-x-auto">
                        {Object.keys(EMOJI_CATEGORIES).map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
                                className={`px-2 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${activeCategory === category
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Emoji grid */}
                    <div className="p-2 max-h-[200px] overflow-y-auto">
                        <div className="grid grid-cols-10 gap-1">
                            {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => insertEmoji(emoji)}
                                    className="w-7 h-7 flex items-center justify-center text-lg rounded hover:bg-[var(--bg-surface)] transition-colors"
                                    title={emoji}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
