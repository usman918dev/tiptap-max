'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    if (!mounted) {
        return (
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] animate-pulse" />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-secondary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300 group"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[var(--color-accent)] group-hover:rotate-45 transition-transform duration-300" />
            ) : (
                <Moon className="w-5 h-5 text-[var(--color-primary)] group-hover:-rotate-12 transition-transform duration-300" />
            )}
        </button>
    );
}
