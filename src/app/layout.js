import './globals.css';

export const metadata = {
    title: 'Tiptap-Max | Advanced Rich Text Editor for Modern Web Apps',
    description: 'Tiptap-Max is a premium, feature-rich text editor built on Tiptap. Supports tables, images, code blocks with syntax highlighting, and more. The ultimate editor for developers and content creators.',
    keywords: ['tiptap', 'rich text editor', 'WYSIWYG', 'React editor', 'Next.js editor', 'content editor', 'text formatting'],
    authors: [{ name: 'Tiptap-Max Team' }],
    creator: 'Tiptap-Max',
    publisher: 'Tiptap-Max',
    metadataBase: new URL('https://tiptap-max.dev'),
    openGraph: {
        title: 'Tiptap-Max | Advanced Rich Text Editor',
        description: 'The ultimate rich text editor for modern web applications. Feature-rich, customizable, and developer-friendly.',
        url: 'https://tiptap-max.dev',
        siteName: 'Tiptap-Max',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Tiptap-Max Editor Preview',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tiptap-Max | Advanced Rich Text Editor',
        description: 'The ultimate rich text editor for modern web applications.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

// JSON-LD Structured Data
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Tiptap-Max',
    applicationCategory: 'DeveloperApplication',
    description: 'Advanced rich text editor built on Tiptap with premium features for modern web applications.',
    operatingSystem: 'Web Browser',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1250',
    },
    featureList: [
        'Rich text formatting',
        'Table support with resize',
        'Image upload and embedding',
        'Code blocks with syntax highlighting',
        'Custom HTML blocks',
        'Text alignment',
        'Highlight and annotations',
        'LocalStorage auto-save',
    ],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
