import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../index.css'
import QueryProvider from '../providers/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rahul | Personal Portfolio',
  description: 'Personal portfolio showcasing my work, resume, and contact information.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
