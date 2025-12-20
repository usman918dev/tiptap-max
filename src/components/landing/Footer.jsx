'use client';

import Link from 'next/link';
import { Github, Twitter, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t border-[var(--border-secondary)] bg-[var(--bg-surface)]/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">T</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                                Tiptap-Max
                            </span>
                        </div>
                        <p className="text-[var(--text-secondary)] max-w-md leading-relaxed">
                            A premium, feature-rich editor built on Tiptap. Empowering developers and content creators with modern editing capabilities.
                        </p>
                        <div className="flex items-center gap-4">
                            <a 
                                href="https://github.com/yourusername/tiptap-max"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-secondary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300 group"
                                aria-label="GitHub"
                            >
                                <Github className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--color-primary)]" />
                            </a>
                            <a 
                                href="https://twitter.com/tiptapmax"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-secondary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300 group"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--color-primary)]" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/#features" className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/playground" className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                                    Playground
                                </Link>
                            </li>
                            <li>
                                <a 
                                    href="https://github.com/yourusername/tiptap-max" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1"
                                >
                                    Documentation
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://github.com/yourusername/tiptap-max/issues" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1"
                                >
                                    Report Issue
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <a 
                                    href="https://tiptap.dev" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1"
                                >
                                    Tiptap Docs
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://nextjs.org" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1"
                                >
                                    Next.js
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://tailwindcss.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1"
                                >
                                    Tailwind CSS
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://github.com/yourusername/tiptap-max/blob/main/LICENSE" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                                >
                                    MIT License
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[var(--border-secondary)] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-[var(--text-muted)]">
                        © {currentYear} Tiptap-Max. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                        <span>for developers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
