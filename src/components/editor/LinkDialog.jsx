'use client';

import { useState, useEffect } from 'react';
import { Link as LinkIcon, X, ExternalLink } from 'lucide-react';

export default function LinkDialog({ isOpen, onClose, onInsert, editor }) {
    const [url, setUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [relAttributes, setRelAttributes] = useState({
        nofollow: true, // default
        ugc: false,
        sponsored: false,
        noopener: false,
        noreferrer: false,
    });
    const [isFollow, setIsFollow] = useState(false);

    useEffect(() => {
        if (isOpen && editor) {
            // Reset to defaults first
            setUrl('');
            setLinkText('');
            setRelAttributes({
                nofollow: true,
                ugc: false,
                sponsored: false,
                noopener: false,
                noreferrer: false,
            });
            setIsFollow(false);

            // Get current link attributes if editing existing link
            const { href, rel } = editor.getAttributes('link');
            if (href) {
                setUrl(href);
                
                if (!rel || rel === '') {
                    setIsFollow(true);
                    setRelAttributes({
                        nofollow: false,
                        ugc: false,
                        sponsored: false,
                        noopener: false,
                        noreferrer: false,
                    });
                } else {
                    setIsFollow(false);
                    const relArray = rel.split(' ');
                    setRelAttributes({
                        nofollow: relArray.includes('nofollow'),
                        ugc: relArray.includes('ugc'),
                        sponsored: relArray.includes('sponsored'),
                        noopener: relArray.includes('noopener'),
                        noreferrer: relArray.includes('noreferrer'),
                    });
                }
            }

            // Get selected text
            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to, '');
            if (selectedText) {
                setLinkText(selectedText);
            }
        }
    }, [isOpen, editor]);

    const handleReset = () => {
        setUrl('');
        setLinkText('');
        setRelAttributes({
            nofollow: true,
            ugc: false,
            sponsored: false,
            noopener: false,
            noreferrer: false,
        });
        setIsFollow(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleFollowChange = (checked) => {
        setIsFollow(checked);
        if (checked) {
            // If follow is checked, uncheck all rel attributes
            setRelAttributes({
                nofollow: false,
                ugc: false,
                sponsored: false,
                noopener: false,
                noreferrer: false,
            });
        } else {
            // If follow is unchecked, set nofollow as default
            setRelAttributes({
                nofollow: true,
                ugc: false,
                sponsored: false,
                noopener: false,
                noreferrer: false,
            });
        }
    };

    const handleRelAttributeChange = (attribute) => {
        if (isFollow) {
            setIsFollow(false);
        }
        setRelAttributes(prev => ({
            ...prev,
            [attribute]: !prev[attribute],
        }));
    };

    const handleInsert = () => {
        if (!url) return;

        // Build rel attribute string
        let rel = '';
        if (!isFollow) {
            const activeRels = Object.keys(relAttributes).filter(key => relAttributes[key]);
            rel = activeRels.join(' ');
        }

        onInsert({ url, linkText, rel });
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-500 p-4 animate-fadeIn">
            <div className="bg-[var(--bg-elevated)] rounded-2xl max-w-lg w-full mt- max-h-[80vh] shadow-2xl border border-[var(--border-primary)] flex flex-col">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <LinkIcon className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white">Insert/Edit Link</h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto">
                    {/* URL Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            URL *
                        </label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-4 py-3 bg-[var(--bg-surface)] border-2 border-[var(--border-secondary)] rounded-xl focus:border-blue-500 transition-all outline-none text-[var(--text-primary)]"
                            autoFocus
                        />
                    </div>

                    {/* Link Text Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[var(--text-primary)]">
                            Link Text (optional)
                        </label>
                        <input
                            type="text"
                            value={linkText}
                            onChange={(e) => setLinkText(e.target.value)}
                            placeholder="Click here"
                            className="w-full px-4 py-3 bg-[var(--bg-surface)] border-2 border-[var(--border-secondary)] rounded-xl focus:border-blue-500 transition-all outline-none text-[var(--text-primary)]"
                        />
                    </div>

                    {/* Link Attributes Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-[var(--text-primary)]">
                            Link Attributes (rel)
                        </label>
                        
                        <div className="bg-[var(--bg-surface)] rounded-xl p-4 space-y-3 border-2 border-[var(--border-secondary)]">
                            {/* Follow Toggle */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-elevated)]">
                                <div>
                                    <div className="text-sm font-medium text-[var(--text-primary)]">Follow Link</div>
                                    <div className="text-xs text-[var(--text-muted)]">Allow search engines to follow this link</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleFollowChange(!isFollow)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isFollow ? 'bg-blue-500' : 'bg-gray-400'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            isFollow ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            {!isFollow && (
                                <>
                                    <div className="border-t border-[var(--border-secondary)] my-2"></div>

                                    {/* NoFollow */}
                                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={relAttributes.nofollow}
                                                onChange={() => handleRelAttributeChange('nofollow')}
                                                className="w-4 h-4 accent-blue-500 rounded"
                                            />
                                    <div>
                                        <div className="text-sm font-medium text-[var(--text-primary)]">NoFollow</div>
                                        <div className="text-xs text-[var(--text-muted)]">Don't pass SEO value to this link</div>
                                    </div>
                                </div>
                            </label>

                                    {/* UGC */}
                                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={relAttributes.ugc}
                                                onChange={() => handleRelAttributeChange('ugc')}
                                                className="w-4 h-4 accent-blue-500 rounded"
                                            />
                                    <div>
                                        <div className="text-sm font-medium text-[var(--text-primary)]">UGC</div>
                                        <div className="text-xs text-[var(--text-muted)]">User Generated Content (comments, forums)</div>
                                    </div>
                                </div>
                            </label>

                                    {/* Sponsored */}
                                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={relAttributes.sponsored}
                                                onChange={() => handleRelAttributeChange('sponsored')}
                                                className="w-4 h-4 accent-blue-500 rounded"
                                            />
                                    <div>
                                        <div className="text-sm font-medium text-[var(--text-primary)]">Sponsored</div>
                                        <div className="text-xs text-[var(--text-muted)]">Paid or sponsored link</div>
                                    </div>
                                </div>
                            </label>

                                    {/* NoOpener */}
                                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={relAttributes.noopener}
                                                onChange={() => handleRelAttributeChange('noopener')}
                                                className="w-4 h-4 accent-blue-500 rounded"
                                            />
                                    <div>
                                        <div className="text-sm font-medium text-[var(--text-primary)]">NoOpener</div>
                                        <div className="text-xs text-[var(--text-muted)]">Security: prevent access to window.opener</div>
                                    </div>
                                </div>
                            </label>

                                    {/* NoReferrer */}
                                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={relAttributes.noreferrer}
                                                onChange={() => handleRelAttributeChange('noreferrer')}
                                                className="w-4 h-4 accent-blue-500 rounded"
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-[var(--text-primary)]">NoReferrer</div>
                                                <div className="text-xs text-[var(--text-muted)]">Don't send referrer information</div>
                                            </div>
                                        </div>
                                    </label>
                                </>
                            )}
                        </div>

                        {/* Preview of rel attribute */}
                        {!isFollow && Object.values(relAttributes).some(v => v) && (
                            <div className="text-xs text-[var(--text-muted)] mt-2 p-2 bg-[var(--bg-surface)] rounded-lg">
                                <span className="font-semibold">rel="</span>
                                {Object.keys(relAttributes)
                                    .filter(key => relAttributes[key])
                                    .join(' ')}
                                <span className="font-semibold">"</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 bg-[var(--bg-surface)] rounded-b-2xl border-t border-[var(--border-secondary)] flex justify-end space-x-3">
                    <button
                        onClick={handleClose}
                        className="px-5 py-2.5 text-[var(--text-secondary)] bg-[var(--bg-elevated)] border-2 border-[var(--border-secondary)] rounded-lg hover:bg-[var(--bg-base)] transition-all font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        disabled={!url}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                    >
                        Insert Link
                    </button>
                </div>
            </div>
        </div>
    );
}
