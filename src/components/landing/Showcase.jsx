'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Showcase() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-accent)]/5"></div>
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[128px] opacity-10"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Content */}
                    <div className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 border border-[var(--border-primary)] mb-4">
                            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                            <span className="text-sm font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                                Try it yourself
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
                            Experience the
                            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent"> Power </span>
                            Yourself
                        </h2>
                        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Jump into our interactive playground and start creating amazing content right away. No setup required.
                        </p>
                    </div>

                    {/* Showcase Visual */}
                    <div className="relative group">
                        {/* Main showcase card */}
                        <div className="relative rounded-3xl border-2 border-[var(--border-primary)] bg-[var(--bg-surface)] overflow-hidden shadow-2xl group-hover:shadow-[var(--shadow-glow)] transition-all duration-500">
                            {/* Fake Browser Bar */}
                            <div className="flex items-center gap-2 px-6 py-4 bg-[var(--editor-toolbar-bg)] border-b border-[var(--border-secondary)]">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="flex-1 mx-4 px-4 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-secondary)] text-sm text-[var(--text-muted)]">
                                    tiptap-max.dev/playground
                                </div>
                            </div>

                            {/* Editor Preview */}
                            <div className="p-8 space-y-6">
                                {/* Toolbar simulation */}
                                <div className="flex gap-2 pb-4 border-b border-[var(--border-secondary)]">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-secondary)]"></div>
                                    ))}
                                </div>

                                {/* Content simulation */}
                                <div className="space-y-4">
                                    <div className="h-8 w-3/4 bg-gradient-to-r from-[var(--color-primary)]/30 to-[var(--color-accent)]/30 rounded-lg"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-[var(--text-muted)]/20 rounded"></div>
                                        <div className="h-4 w-5/6 bg-[var(--text-muted)]/20 rounded"></div>
                                        <div className="h-4 w-4/6 bg-[var(--text-muted)]/20 rounded"></div>
                                    </div>
                                    
                                    {/* Code block simulation */}
                                    <div className="p-4 bg-[var(--bg-base)] rounded-xl border border-[var(--border-secondary)] space-y-2">
                                        <div className="h-3 w-32 bg-[var(--color-accent)]/40 rounded"></div>
                                        <div className="h-3 w-48 bg-[var(--color-primary)]/40 rounded"></div>
                                        <div className="h-3 w-40 bg-[var(--color-primary)]/40 rounded"></div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-[var(--text-muted)]/20 rounded"></div>
                                        <div className="h-4 w-4/5 bg-[var(--text-muted)]/20 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Animated cursor effect */}
                            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-[var(--color-primary)] rounded-full blur-sm animate-pulse opacity-0 group-hover:opacity-60 transition-opacity"></div>
                        </div>

                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-12">
                        <Link 
                            href="/playground"
                            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white text-lg font-semibold hover:shadow-[var(--shadow-button)] hover:scale-105 transition-all duration-300"
                        >
                            Open Playground
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <p className="mt-4 text-sm text-[var(--text-muted)]">
                            Free forever • No account needed • Start creating instantly
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
