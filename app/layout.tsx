import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TalktoTeach | CallSetu - AI Call Management for Indian Educators',
  description: 'AI Call Manager for independent tutors, home tuitions, and coaching institutes across India. Direct parent inquiries, route trusted contacts, and manage personal transfers during active batches.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'TalktoTeach | CallSetu - AI Call Management for Indian Educators',
    description: 'AI Call Manager for independent tutors, home tuitions, and coaching institutes across India.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalktoTeach | CallSetu - AI Call Management for Indian Educators',
    description: 'AI Call Manager for independent tutors, home tuitions, and coaching institutes across India.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased selection:bg-indigo-100 selection:text-indigo-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
