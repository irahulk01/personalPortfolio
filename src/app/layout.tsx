import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../index.css'
import QueryProvider from '../providers/QueryProvider'
import SmoothScrollProvider from '../providers/SmoothScrollProvider'
import { Header } from '../component/Header/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rahul | Personal Portfolio',
  description: 'Personal portfolio showcasing my work, resume, and contact information.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background`}>
        <QueryProvider>
          <SmoothScrollProvider>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
              <header className="glass-header py-1 sm:py-2 px-2 sm:px-4">
                <Header />
              </header>
              <main className="flex-grow text-textColor px-4 pb-24 lg:pb-4">
                {children}
              </main>
            </div>
          </SmoothScrollProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
