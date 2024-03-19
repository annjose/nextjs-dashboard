import '@/app/ui/global.css';

import { inter } from '@/app/ui/fonts';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'A simple invoicing appl built using Next.js',
  keywords: ['nextjs', 'learn', 'invoice'],
  metadataBase: new URL('https://nextjs-dashboard-tutorial-nine-mu.vercel.app/'),
  creator: 'Ann Catherine Jose'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
