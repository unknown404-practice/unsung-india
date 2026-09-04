'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Sparkles, BookOpen, Send, ShieldAlert, Award, MapPin, Clock } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Heritage Map', href: '/map', icon: MapPin },
    { name: 'Timeline', href: '/timeline', icon: Clock },
    { name: 'Banner Studio', href: '/banners', icon: Sparkles },
    { name: 'Suggest Hero', href: '/suggest', icon: Send },
    { name: 'About & DPI', href: '/about', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl transition-all">
      {/* Top Saffron/Tiranga Accent Indicator */}
      <div className="h-1 w-full bg-gradient-to-r from-saffron-500 via-white to-tiranga-green" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & National Seal Icon */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-amber-700 flex items-center justify-center shadow-saffron-glow border border-saffron-400/40 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-cinematic text-lg sm:text-xl font-bold tracking-wider text-white block leading-tight">
                UNSUNG HEROES
              </span>
              <span className="text-[10px] tracking-widest text-saffron-400 uppercase font-medium block">
                OF INDIA • DIGITAL PUBLIC INFRASTRUCTURE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-saffron-500/15 text-saffron-400 border border-saffron-500/30 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 opacity-80" />}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Button: Fast Banner Builder */}
          <div className="flex items-center gap-3">
            <Link
              href="/banners"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-saffron-400 to-amber-400 hover:from-saffron-300 hover:to-amber-300 transition-all shadow-saffron-glow transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Banner</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
