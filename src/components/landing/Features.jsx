'use client';

import { 
    Table, 
    Image, 
    Code2, 
    Palette, 
    Zap, 
    Puzzle 
} from 'lucide-react';

const features = [
    {
        icon: Table,
        title: 'Rich Tables',
        description: 'Create and edit tables with resizable columns, row/column operations, and custom styling.',
        color: 'from-purple-500 to-violet-500'
    },
    {
        icon: Image,
        title: 'Image Support',
        description: 'Upload and embed images with drag & drop, resize, and caption support with Cloudinary integration.',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Code2,
        title: 'Syntax Highlighting',
        description: 'Code blocks with beautiful syntax highlighting for 180+ languages using Lowlight.',
        color: 'from-green-500 to-emerald-500'
    },
    {
        icon: Palette,
        title: 'Dark/Light Themes',
        description: 'Beautiful themes with smooth transitions. Customizable with CSS variables for your brand.',
        color: 'from-orange-500 to-amber-500'
    },
    {
        icon: Zap,
        title: 'Auto-Save',
        description: 'Never lose your work with automatic localStorage persistence and instant save indicators.',
        color: 'from-pink-500 to-rose-500'
    },
    {
        icon: Puzzle,
        title: '15+ Extensions',
        description: 'Typography, text alignment, subscript, superscript, highlights, links, and custom HTML blocks.',
        color: 'from-indigo-500 to-purple-500'
    }
];

export default function Features() {
    return (
        <section id="features" className="relative py-24 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 grid-background opacity-10"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-[128px] opacity-10"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 border border-[var(--border-primary)] mb-4">
                        <span className="text-sm font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                            Powerful Features
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
                        Everything You Need for
                        <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent"> Rich Content</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)]">
                        Built with modern technologies and designed for developers who demand the best.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group relative p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-secondary)] hover:border-[var(--color-primary)] transition-all duration-500 hover:shadow-[var(--shadow-glow)] hover:scale-105"
                                style={{
                                    animation: 'fadeIn 0.6s ease-out forwards',
                                    animationDelay: `${index * 0.1}s`,
                                    opacity: 0
                                }}
                            >
                                {/* Gradient Background on Hover */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500" 
                                     style={{
                                         backgroundImage: `linear-gradient(135deg, var(--color-primary), var(--color-accent))`
                                     }}
                                ></div>

                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <p className="text-[var(--text-secondary)] mb-4">
                        And many more features to explore...
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {['Markdown Support', 'Keyboard Shortcuts', 'Undo/Redo', 'Link Editing', 'Text Alignment', 'Custom Styles'].map((tag, i) => (
                            <span 
                                key={i}
                                className="px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-secondary)] text-sm text-[var(--text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
