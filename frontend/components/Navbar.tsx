'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Sparkles,
  BookOpen,
  Send,
  Award,
  MapPin,
  Clock,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Clean, non-redundant primary navigation links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Heritage Map', href: '/map', icon: MapPin },
    { name: 'Timeline', href: '/timeline', icon: Clock },
    { name: 'Suggest Hero', href: '/suggest', icon: Send },
    { name: 'About & DPI', href: '/about', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur-xl transition-all">
      {/* Top Tiranga National Accent Indicator */}
      <div className="h-1 w-full bg-gradient-to-r from-saffron-500 via-white to-tiranga-green" />

      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo & National Seal Icon */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-amber-700 flex items-center justify-center shadow-saffron-glow border border-saffron-400/40 group-hover:scale-105 transition-transform shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-cinematic text-sm sm:text-base lg:text-lg font-bold tracking-wider text-white block leading-tight whitespace-nowrap">
                UNSUNG HEROES
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] tracking-widest text-saffron-400 uppercase font-medium block whitespace-nowrap">
                OF INDIA • DIGITAL PUBLIC INFRASTRUCTURE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Spaced comfortably, Never Wraps or Clips) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-saffron-500/15 text-saffron-400 border border-saffron-500/30 shadow-inner font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 opacity-80 shrink-0" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Mod Desk & Create Banner */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Moderation Desk Pill */}
            <Link
              href="/admin/submissions"
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all whitespace-nowrap ${
                pathname === '/admin/submissions'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900/90 text-slate-300 border-white/10 hover:border-emerald-500/30 hover:text-emerald-300'
              }`}
              title="Editorial Moderation Desk"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mod Desk</span>
            </Link>

            {/* Primary Action Button: Create Banner */}
            <Link
              href="/banners"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-saffron-400 to-amber-400 hover:from-saffron-300 hover:to-amber-300 transition-all shadow-saffron-glow transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Create Banner</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-saffron-500/15 text-saffron-400 border border-saffron-500/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-saffron-400" />}
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/admin/submissions"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-emerald-300 border border-emerald-500/30"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Editorial Moderation Desk</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
