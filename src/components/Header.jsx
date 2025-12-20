'use client';

import Link from 'next/link';
import { Github, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-secondary)] backdrop-blur-xl bg-[var(--bg-base)]/80">
            <div className="container mx-auto">
                <nav className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <span className="text-white font-bold text-xl">T</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                            Tiptap-Max
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link 
                            href="/#features" 
                            className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-300"
                        >
                            Features
                        </Link>
                        <Link 
                            href="/playground" 
                            className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-300"
                        >
                            Playground
                        </Link>
                        <a 
                            href="https://github.com/yourusername/tiptap-max" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-300 flex items-center gap-2"
                        >
                            <Github className="w-5 h-5" />
                            GitHub
                        </a>
                        <ThemeToggle />
                        <Link 
                            href="/playground"
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold hover:shadow-[var(--shadow-button)] hover:scale-105 transition-all duration-300"
                        >
                            Try Now
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-[var(--border-secondary)] animate-slideDown">
                        <div className="flex flex-col gap-4">
                            <Link 
                                href="/#features" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors py-2"
                            >
                                Features
                            </Link>
                            <Link 
                                href="/playground" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors py-2"
                            >
                                Playground
                            </Link>
                            <a 
                                href="https://github.com/yourusername/tiptap-max" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 py-2"
                            >
                                <Github className="w-5 h-5" />
                                GitHub
                            </a>
                            <Link 
                                href="/playground"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold text-center"
                            >
                                Try Now
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
