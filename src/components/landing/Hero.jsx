'use client';

import Link from 'next/link';
import { ArrowRight, Github, Star } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 grid-background opacity-20"></div>
            
            {/* Gradient Orbs */}
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-[128px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8 animate-fadeIn">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 border border-[var(--border-primary)]">
                            <Star className="w-4 h-4 text-[var(--color-accent)] fill-[var(--color-accent)]" />
                            <span className="text-sm font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                                Open Source & Free Forever
                            </span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-accent)] bg-clip-text text-transparent">
                                    Premium Rich Text
                                </span>
                                <br />
                                <span className="text-[var(--text-primary)]">Editor for Developers</span>
                            </h1>
                            
                            <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-xl">
                                A powerful, customizable editor built on Tiptap. Perfect for blogs, documentation, and content-heavy applications. Feature-rich, modern UI, and fully open source.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link 
                                href="/playground"
                                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold hover:shadow-[var(--shadow-button)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                                Try Playground
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            
                            <a 
                                href="https://github.com/yourusername/tiptap-max"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-secondary)] text-[var(--text-primary)] font-semibold hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300 flex items-center gap-2"
                            >
                                <Github className="w-5 h-5" />
                                View on GitHub
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 pt-4">
                            <div>
                                <div className="text-3xl font-bold text-[var(--color-primary)]">15+</div>
                                <div className="text-sm text-[var(--text-muted)]">Extensions</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[var(--color-accent)]">100%</div>
                                <div className="text-sm text-[var(--text-muted)]">Open Source</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[var(--color-primary)]">∞</div>
                                <div className="text-sm text-[var(--text-muted)]">Customizable</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="relative animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <div className="relative">
                            {/* SVG Illustration */}
                            <svg viewBox="0 0 500 500" className="w-full h-auto drop-shadow-2xl">
                                {/* Editor Window */}
                                <g>
                                    {/* Window Background */}
                                    <rect x="50" y="80" width="400" height="340" rx="16" fill="var(--bg-surface)" stroke="var(--border-primary)" strokeWidth="2"/>
                                    
                                    {/* Window Header */}
                                    <rect x="50" y="80" width="400" height="40" rx="16" fill="var(--editor-toolbar-bg)"/>
                                    <rect x="50" y="96" width="400" height="24" fill="var(--editor-toolbar-bg)"/>
                                    
                                    {/* Window Buttons */}
                                    <circle cx="70" cy="100" r="5" fill="#ff5f57"/>
                                    <circle cx="90" cy="100" r="5" fill="#ffbd2e"/>
                                    <circle cx="110" cy="100" r="5" fill="#28ca42"/>
                                    
                                    {/* Toolbar Icons */}
                                    <rect x="160" y="93" width="20" height="14" rx="2" fill="var(--color-primary)" opacity="0.3"/>
                                    <rect x="185" y="93" width="20" height="14" rx="2" fill="var(--color-primary)" opacity="0.3"/>
                                    <rect x="210" y="93" width="20" height="14" rx="2" fill="var(--color-primary)" opacity="0.3"/>
                                    
                                    {/* Editor Content Lines */}
                                    <rect x="70" y="140" width="200" height="12" rx="4" fill="var(--color-primary)" opacity="0.6"/>
                                    <rect x="70" y="165" width="350" height="8" rx="4" fill="var(--text-muted)" opacity="0.3"/>
                                    <rect x="70" y="180" width="320" height="8" rx="4" fill="var(--text-muted)" opacity="0.3"/>
                                    <rect x="70" y="195" width="340" height="8" rx="4" fill="var(--text-muted)" opacity="0.3"/>
                                    
                                    {/* Code Block */}
                                    <rect x="70" y="220" width="360" height="80" rx="8" fill="var(--bg-base)" opacity="0.5"/>
                                    <rect x="85" y="235" width="120" height="6" rx="3" fill="var(--color-accent)" opacity="0.6"/>
                                    <rect x="85" y="250" width="200" height="6" rx="3" fill="var(--color-primary)" opacity="0.4"/>
                                    <rect x="85" y="265" width="180" height="6" rx="3" fill="var(--color-primary)" opacity="0.4"/>
                                    <rect x="85" y="280" width="150" height="6" rx="3" fill="var(--color-accent)" opacity="0.6"/>
                                    
                                    {/* More Content Lines */}
                                    <rect x="70" y="320" width="300" height="8" rx="4" fill="var(--text-muted)" opacity="0.3"/>
                                    <rect x="70" y="335" width="280" height="8" rx="4" fill="var(--text-muted)" opacity="0.3"/>
                                    <rect x="70" y="350" width="330" height="8" rx="4" fill="var(--text-muted)" opacity="0.3"/>
                                    <rect x="70" y="380" width="150" height="24" rx="12" fill="var(--color-primary)" opacity="0.8"/>
                                </g>
                                
                                {/* Floating Icons */}
                                <circle cx="420" cy="150" r="30" fill="var(--color-primary)" opacity="0.2" className="animate-float"/>
                                <circle cx="80" cy="350" r="25" fill="var(--color-accent)" opacity="0.2" className="animate-float" style={{ animationDelay: '0.5s' }}/>
                                <circle cx="430" cy="380" r="20" fill="var(--color-primary)" opacity="0.15" className="animate-float" style={{ animationDelay: '1s' }}/>
                            </svg>

                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
