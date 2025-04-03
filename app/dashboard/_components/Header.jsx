'use client';

import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Header() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/dashboard');
  };

  return (
    <div className="p-5 shadow-sm flex justify-between items-center bg-zinc-900 border-b border-zinc-800 rounded-bl-3xl rounded-br-3xl">
      <div
        className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => router.push('/')}
      >
        <div className="bg-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 text-xs font-bold">DM</div>
        <h2 className="font-bold text-lg bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text">DecorMind</h2>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        <nav className="flex gap-6">
          <Link href="/dashboard" className="text-white hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <Link href="/redesign" className="text-white hover:text-cyan-400 transition-colors">
            Redesign
          </Link>
          <Link href="/decormind" className="text-white hover:text-cyan-400 transition-colors">
            DecorMind
          </Link>
          <Link href="/pricing" className="text-white hover:text-cyan-400 transition-colors">
            Pricing
          </Link>
          <Link href="/contact-us" className="nav-link hover:text-cyan-400 text-white transition-colors duration-300">
            Contact Us
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/favorites" className="text-white hover:text-cyan-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:fill-cyan-400 transition-colors">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}

export default Header;