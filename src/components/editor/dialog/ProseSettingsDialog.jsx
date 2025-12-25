'use client';

import { useState, useEffect } from 'react';
import { X, Settings2 } from 'lucide-react';

const PROSE_SIZES = [
    { label: 'Small', value: 'prose-sm' },
    { label: 'Base', value: 'prose-base' },
    { label: 'Large', value: 'prose-lg' },
    { label: 'XL', value: 'prose-xl' },
    { label: '2XL', value: 'prose-2xl' },
];

const PROSE_COLORS = [
    { label: 'Gray', value: 'prose-gray' },
    { label: 'Zinc', value: 'prose-zinc' },
    { label: 'Neutral', value: 'prose-neutral' },
    { label: 'Slate', value: 'prose-slate' },
    { label: 'Stone', value: 'prose-stone' },
];

const PRESET_THEMES = [
    { label: 'Clean Blog', classes: 'prose-lg prose-gray' },
    { label: 'Documentation', classes: 'prose-base prose-slate' },
    { label: 'Article', classes: 'prose-xl prose-neutral' },
    { label: 'Compact', classes: 'prose-sm prose-zinc' },
];

const STORAGE_KEY = 'tiptap-prose-settings';

export default function ProseSettingsDialog({ isOpen, onClose, onApply, currentSettings }) {
    const [size, setSize] = useState(currentSettings?.size || 'prose-base');
    const [color, setColor] = useState(currentSettings?.color || 'prose-gray');
    const [customClasses, setCustomClasses] = useState(currentSettings?.customClasses || '');
    const [darkInvert, setDarkInvert] = useState(currentSettings?.darkInvert ?? true);

    useEffect(() => {
        if (currentSettings) {
            setSize(currentSettings.size || 'prose-base');
            setColor(currentSettings.color || 'prose-gray');
            setCustomClasses(currentSettings.customClasses || '');
            setDarkInvert(currentSettings.darkInvert ?? true);
        }
    }, [currentSettings]);

    const handleApply = () => {
        const settings = { size, color, customClasses, darkInvert };
        onApply(settings);
        onClose();
    };

    const handlePreset = (preset) => {
        const parts = preset.classes.split(' ');
        const sizeClass = parts.find(p => p.startsWith('prose-') && PROSE_SIZES.some(s => s.value === p));
        const colorClass = parts.find(p => p.startsWith('prose-') && PROSE_COLORS.some(c => c.value === p));
        if (sizeClass) setSize(sizeClass);
        if (colorClass) setColor(colorClass);
    };

    const handleReset = () => {
        setSize('prose-base');
        setColor('prose-gray');
        setCustomClasses('');
        setDarkInvert(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-[var(--bg-elevated)] border border-[var(--border-secondary)] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-secondary)]">
                    <div className="flex items-center gap-3">
                        <Settings2 className="w-5 h-5 text-[var(--color-primary)]" />
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Editor Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors"
                    >
                        <X className="w-5 h-5 text-[var(--text-muted)]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
                    {/* Presets */}
                    <div>
                        <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">Quick Presets</label>
                        <div className="grid grid-cols-2 gap-2">
                            {PRESET_THEMES.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => handlePreset(preset)}
                                    className="px-3 py-2 text-sm rounded-lg border border-[var(--border-secondary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all text-[var(--text-secondary)] hover:text-[var(--color-primary)]"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div>
                        <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">Text Size</label>
                        <div className="flex flex-wrap gap-2">
                            {PROSE_SIZES.map((s) => (
                                <button
                                    key={s.value}
                                    onClick={() => setSize(s.value)}
                                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${size === s.value
                                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                                        : 'border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--color-primary)]'
                                        }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">Color Theme</label>
                        <div className="flex flex-wrap gap-2">
                            {PROSE_COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    onClick={() => setColor(c.value)}
                                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${color === c.value
                                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                                        : 'border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--color-primary)]'
                                        }`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dark Mode Invert */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-[var(--text-primary)]">Dark Mode Invert</label>
                        <button
                            onClick={() => setDarkInvert(!darkInvert)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${darkInvert ? 'bg-[var(--color-primary)]' : 'bg-[var(--bg-surface)]'
                                }`}
                        >
                            <span
                                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${darkInvert ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Custom Classes */}
                    <div>
                        <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">Custom Tailwind Classes</label>
                        <textarea
                            value={customClasses}
                            onChange={(e) => setCustomClasses(e.target.value)}
                            placeholder="e.g., max-w-none prose-headings:underline"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] font-mono resize-none h-20"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-1">Add any Tailwind typography modifier classes</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--border-secondary)] bg-[var(--bg-surface)]">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                        Reset
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-lg border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-4 py-2 text-sm rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
