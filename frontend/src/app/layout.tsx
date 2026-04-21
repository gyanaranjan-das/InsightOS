import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InsightOS — AI-Powered SaaS Analytics',
  description: 'Unleash the power of AI on your SaaS data.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background antialiased text-foreground`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
