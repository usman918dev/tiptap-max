import Header from '@/components/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Showcase from '@/components/landing/Showcase';
import Footer from '@/components/landing/Footer';

export default function Home() {
    return (
        <main className="min-h-screen bg-[var(--bg-base)]">
            <Header />
            <Hero />
            <Features />
            <Showcase />
            <Footer />
        </main>
    );
}
