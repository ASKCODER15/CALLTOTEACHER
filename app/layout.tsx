import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Call to Teach | AI Call Management for Teachers & Tutors',
  description: 'Multi-tenant AI call-management SaaS platform for independent tutors, private teachers, and coaching institutes across India. Shield your teaching hours, automate routine fee & batch enquiries, and screen personal calls.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Call to Teach | AI Call Management for Teachers & Tutors',
    description: 'Teach without interruptions. Intelligent call screening and verified knowledge base answers for tutors across India.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Call to Teach | AI Call Management for Teachers & Tutors',
    description: 'Teach without interruptions. Intelligent call screening and verified knowledge base answers for tutors across India.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased selection:bg-[#C86D51]/20 selection:text-[#132238]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
