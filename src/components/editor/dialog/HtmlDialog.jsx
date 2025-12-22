'use client';

import { FileCode, X } from 'lucide-react';

export default function HtmlDialog({ isOpen, onClose, onInsert, htmlContent, setHtmlContent }) {
    if (!isOpen) return null;

    const handleInsert = () => {
        onInsert();
        onClose();
    };

    const handleCancel = () => {
        setHtmlContent('');
        onClose();
    };

    return (
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
                            onClick={handleCancel}
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
                        onClick={handleCancel}
                        className="px-5 py-2.5 text-[var(--text-secondary)] bg-[var(--bg-elevated)] border-2 border-[var(--border-secondary)] rounded-lg hover:bg-[var(--bg-base)] transition-all font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        disabled={!htmlContent}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Insert HTML
                    </button>
                </div>
            </div>
        </div>
    );
}
