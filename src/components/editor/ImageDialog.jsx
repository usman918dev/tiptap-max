'use client';

import { useState } from 'react';
import { Image as ImageIcon, X, Upload } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function ImageDialog({ isOpen, onClose, onInsert }) {
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [isImageUploading, setIsImageUploading] = useState(false);

    const handleReset = () => {
        setImageUrl('');
        setImageAlt('');
        setIsImageUploading(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        setIsImageUploading(true);

        try {
            const result = await uploadToCloudinary(file, 'blog-images');

            if (!result.success) {
                alert(result.error || 'Failed to upload image. Please try again.');
                return;
            }

            setImageUrl(result.url);
        } catch (err) {
            alert('Failed to upload image. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setIsImageUploading(false);
        }
    };

    const handleInsert = () => {
        if (!imageUrl || !imageAlt) return;
        onInsert({ url: imageUrl, alt: imageAlt });
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-[var(--bg-elevated)] rounded-2xl max-w-lg w-full shadow-2xl border border-[var(--border-primary)]">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <ImageIcon className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white">Insert Image</h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[var(--text-primary)]">Choose Image *</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isImageUploading}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="flex items-center justify-center w-full p-6 border-2 border-dashed border-[var(--border-secondary)] rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-500/10 transition-all group"
                            >
                                <div className="text-center">
                                    {isImageUploading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                                            <span className="text-green-500 font-medium">Uploading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 text-[var(--text-muted)] group-hover:text-green-500 mx-auto mb-2" />
                                            <p className="text-sm text-[var(--text-secondary)]">Click to upload or drag and drop</p>
                                            <p className="text-xs text-[var(--text-muted)] mt-1">PNG, JPG, GIF up to 5MB</p>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border-secondary)]" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[var(--bg-elevated)] text-[var(--text-muted)]">or enter URL</span>
                        </div>
                    </div>

                    <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 bg-[var(--bg-surface)] border-2 border-[var(--border-secondary)] rounded-xl focus:border-green-500 transition-all outline-none text-[var(--text-primary)]"
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[var(--text-primary)]">Alt Text (Accessibility) *</label>
                        <input
                            type="text"
                            value={imageAlt}
                            onChange={(e) => setImageAlt(e.target.value)}
                            placeholder="Describe the image"
                            className="w-full px-4 py-3 bg-[var(--bg-surface)] border-2 border-[var(--border-secondary)] rounded-xl focus:border-green-500 transition-all outline-none text-[var(--text-primary)]"
                        />
                    </div>

                    {imageUrl && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--text-primary)]">Preview</label>
                            <div className="border-2 border-[var(--border-secondary)] rounded-xl p-4">
                                <img
                                    src={imageUrl}
                                    alt={imageAlt || 'Preview'}
                                    className="max-w-full h-auto rounded-lg"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    )}
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
                        disabled={!imageUrl || !imageAlt || isImageUploading}
                        className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Insert Image
                    </button>
                </div>
            </div>
        </div>
    );
}
