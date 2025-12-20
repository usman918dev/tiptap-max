import Hero from '@/components/landing/Hero';

import ThemeToggle from '@/components/ThemeToggle';

// Navigation component
function Navigation() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="40" height="40" rx="10" fill="url(#nav-logo-gradient)" />
                            <path d="M12 14H28M12 20H24M12 26H20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="nav-logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#8b5cf6" />
                                    <stop offset="1" stopColor="#f59e0b" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="text-lg font-bold text-gradient">Tiptap-Max</span>
                    </div>

                    {/* Nav links */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                            Features
                        </a>
                        <a href="#" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                            Docs
                        </a>
                        <a href="#" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                            Examples
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                            GitHub
                        </a>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <a
                            href="#"
                            className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default function Home() {
    return (
        <main className="min-h-screen">
            <Navigation />
            <Hero />

        </main>
    );
}
