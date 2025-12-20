import TiptapMaxEditor from '@/components/editor/TiptapMaxEditor';

// SVG Wave decoration component
const WaveDecoration = ({ className = '', flip = false }) => (
    <svg
        className={`absolute w-full h-auto ${flip ? 'rotate-180' : ''} ${className}`}
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
    >
        <path
            d="M0 60L48 55C96 50 192 40 288 45C384 50 480 70 576 75C672 80 768 70 864 55C960 40 1056 20 1152 25C1248 30 1344 60 1392 75L1440 90V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z"
            fill="url(#wave-gradient)"
        />
        <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="rgba(139, 92, 246, 0.1)" />
                <stop offset="0.5" stopColor="rgba(245, 158, 11, 0.1)" />
                <stop offset="1" stopColor="rgba(139, 92, 246, 0.1)" />
            </linearGradient>
        </defs>
    </svg>
);

// Floating orbs decoration
const FloatingOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-primary)]/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
    </div>
);

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
            {/* Background decorations */}
            <FloatingOrbs />
            <WaveDecoration className="bottom-0" />
            <div className="pattern-dots absolute inset-0 opacity-30" />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-base)]" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header content */}
                    <div className="text-center mb-16 animate-slideDown">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass border border-[var(--border-accent)]">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                            <span className="text-sm font-medium text-[var(--text-accent)]">
                                Premium Rich Text Editor
                            </span>
                        </div>

                        {/* Main headline */}
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                            <span className="text-[var(--text-primary)]">The </span>
                            <span className="text-gradient">Legendary</span>
                            <br />
                            <span className="text-[var(--text-primary)]">Text Editor</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-8 leading-relaxed">
                            Tiptap-Max brings enterprise-grade editing to your web applications.
                            <br className="hidden md:block" />
                            <span className="text-[var(--color-primary-light)]">Beautiful</span>,{' '}
                            <span className="text-[var(--color-accent)]">powerful</span>, and{' '}
                            <span className="text-gradient-gold">developer-friendly</span>.
                        </p>

                        {/* Feature pills */}
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {['Tables', 'Images', 'Code Blocks', 'HTML Blocks', 'Auto-Save'].map((feature) => (
                                <span
                                    key={feature}
                                    className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-surface)] rounded-full border border-[var(--border-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all cursor-default"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Editor Demo */}
                    <div className="relative animate-slideUp" style={{ animationDelay: '0.3s' }}>
                        {/* Glow effect behind editor */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-accent)]/10 to-[var(--color-primary)]/20 rounded-3xl blur-2xl opacity-50" />

                        {/* Editor wrapper */}
                        <div className="relative bg-[var(--bg-surface)] p-4 md:p-6 rounded-2xl border border-[var(--border-primary)] shadow-2xl">
                            {/* Browser-like header */}
                            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[var(--border-secondary)]">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="px-4 py-1.5 bg-[var(--bg-base)] rounded-lg text-xs text-[var(--text-muted)] font-mono">
                                        tiptap-max-editor
                                    </div>
                                </div>
                                <div className="w-16" /> {/* Spacer for symmetry */}
                            </div>

                            {/* Actual editor */}
                            <TiptapMaxEditor />
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="flex justify-center mt-16 animate-fadeIn" style={{ animationDelay: '1s' }}>
                        <div className="flex flex-col items-center text-[var(--text-muted)]">
                            <span className="text-sm mb-2">Explore Features</span>
                            <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
