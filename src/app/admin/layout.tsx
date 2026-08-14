"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiBarChart2, FiMail, FiCalendar, FiSettings, FiLogOut, FiMoon, FiBell, FiSearch, FiLayers, FiArrowLeft } from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#171821] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#21222d] flex flex-col rounded-r-3xl my-4 ml-4 p-6 overflow-y-auto">
        <div className="flex items-center gap-3 pb-8 px-3 font-bold text-xl text-white tracking-wide">
          <div className="text-[#a8a5ff] text-2xl">
            <FiLayers />
          </div>
          <span>APP MANAGER</span>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <Link 
            href="/admin/portfolio" 
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-sm transition-all ${
              pathname === '/admin' || pathname?.startsWith('/admin/portfolio')
                ? 'bg-[#2b2b36] text-white' 
                : 'text-[#87888c] hover:bg-[#2b2b36] hover:text-white'
            }`}
          >
            <FiGrid className="text-lg" />
            Portfolio
          </Link>
          <Link 
            href="#" 
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-sm text-[#87888c] hover:bg-[#2b2b36] hover:text-white transition-all"
          >
            <FiBarChart2 className="text-lg" />
            Analytics
          </Link>
          <Link 
            href="#" 
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-sm text-[#87888c] hover:bg-[#2b2b36] hover:text-white transition-all"
          >
            <FiMail className="text-lg" />
            Mail
          </Link>
          <Link 
            href="#" 
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-sm text-[#87888c] hover:bg-[#2b2b36] hover:text-white transition-all"
          >
            <FiCalendar className="text-lg" />
            Calendar
          </Link>
          <Link 
            href="#" 
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-sm text-[#87888c] hover:bg-[#2b2b36] hover:text-white transition-all"
          >
            <FiSettings className="text-lg" />
            Settings
          </Link>

          <div className="mt-auto pt-6 flex flex-col gap-1">
            <Link 
              href="/" 
              className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm text-[#87888c] hover:bg-[#2b2b36] hover:text-white transition-all"
            >
              <FiArrowLeft className="text-lg text-[#a8a5ff]" />
              Live Portfolio
            </Link>
            <Link 
              href="/adminLogin" 
              className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-sm text-[#87888c] hover:bg-[#2b2b36] hover:text-white transition-all"
            >
              <FiLogOut className="text-lg" />
              Log out
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-8 py-4 overflow-y-auto">
        <header className="flex items-center justify-between py-4 pb-8">
          <h1 className="text-3xl font-bold text-white">
            {pathname === '/admin' ? 'Portfolio' : pathname === '/admin/contacts' ? 'Contacts' : 'Portfolio'}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#21222d] px-4 py-2.5 rounded-full w-60">
              <FiSearch className="text-[#87888c]" />
              <input type="text" placeholder="Search here..." className="bg-transparent border-none text-white outline-none w-full text-sm placeholder-[#87888c]" />
            </div>
            
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#21222d] text-[#87888c] cursor-pointer hover:bg-[#2b2b36] hover:text-white transition-colors">
              <FiMoon />
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#21222d] text-[#87888c] cursor-pointer hover:bg-[#2b2b36] hover:text-white transition-colors">
              <FiBell />
            </div>
            <div className="w-10 h-10 rounded-full bg-[#a8a5ff] overflow-hidden flex items-center justify-center">
              <img src="/resume_image.jpeg" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
