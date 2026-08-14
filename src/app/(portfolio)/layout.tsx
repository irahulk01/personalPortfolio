import React from 'react'
import SessionAnalyticsProvider from '../../providers/SessionAnalyticsProvider'
import SmoothScrollProvider from '../../providers/SmoothScrollProvider'
import { Header } from '../../component/Header/Header'

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <SessionAnalyticsProvider>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <header className="glass-header py-1 sm:py-2 px-2 sm:px-4">
            <Header />
          </header>
          <main className="flex-grow text-textColor max-w-[72rem] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8 pt-16 lg:pt-20">
            {children}
          </main>
        </div>
      </SessionAnalyticsProvider>
    </SmoothScrollProvider>
  );
}
