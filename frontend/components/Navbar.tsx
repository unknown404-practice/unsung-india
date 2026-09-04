'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, BookOpen, Send, Award, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Heritage Map', href: '/map', icon: MapPin },
    { name: 'Timeline', href: '/timeline', icon: Clock },
    { name: 'Banner Studio', href: '/banners', icon: Sparkles },
    { name: 'Suggest Hero', href: '/suggest', icon: Send },
    { name: 'Mod Desk', href: '/admin/submissions', icon: ShieldCheck },
    { name: 'About & DPI', href: '/about', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/90 backdrop-blur-xl transition-all">
      {/* Top Saffron/Tiranga Accent Indicator */}
      <div className="h-1 w-full bg-gradient-to-r from-saffron-500 via-white to-tiranga-green" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo & National Seal Icon */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-amber-700 flex items-center justify-center shadow-saffron-glow border border-saffron-400/40 group-hover:scale-105 transition-transform shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-cinematic text-base lg:text-lg font-bold tracking-wider text-white block leading-tight whitespace-nowrap">
                UNSUNG HEROES
              </span>
              <span className="text-[9px] lg:text-[10px] tracking-widest text-saffron-400 uppercase font-medium block whitespace-nowrap">
                OF INDIA • DIGITAL PUBLIC INFRASTRUCTURE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (100% Single Line, Never Wraps) */}
          <nav className="hidden xl:flex items-center gap-1.5 shrink-0">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-saffron-500/15 text-saffron-400 border border-saffron-500/30 shadow-inner font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 opacity-85 shrink-0" />}
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Medium Screen Nav (Compact Icons & Single Line) */}
          <nav className="hidden md:flex xl:hidden items-center gap-1 shrink-0 overflow-x-auto">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-saffron-500/15 text-saffron-400 border border-saffron-500/30 shadow-inner font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 opacity-85 shrink-0" />}
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Button: Fast Banner Builder */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/banners"
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-saffron-400 to-amber-400 hover:from-saffron-300 hover:to-amber-300 transition-all shadow-saffron-glow transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Create Banner</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
