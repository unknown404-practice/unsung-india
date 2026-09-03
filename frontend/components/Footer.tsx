import Link from 'next/link';
import { ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface/80 backdrop-blur-md mt-24 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Mission & DPI */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-cinematic font-bold text-lg">
              <span>UNSUNG HEROES OF INDIA</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg">
              A sovereign Digital Public Infrastructure (DPI) initiative to document, verify, and celebrate the forgotten freedom fighters, indigenous leaders, pioneering scientists, and social reformers of Bharat. Built with open standards, zero commercial paywalls, and free public banner generation for Indian transit infrastructure.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-saffron-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict Anti-Hallucination & Primary Provenance Policy</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link href="/explore" className="hover:text-saffron-400 transition-colors">Explore All Heroes</Link></li>
              <li><Link href="/banners" className="hover:text-saffron-400 transition-colors">Banner Studio</Link></li>
              <li><Link href="/suggest" className="hover:text-saffron-400 transition-colors">Suggest a Local Hero</Link></li>
              <li><Link href="/about" className="hover:text-saffron-400 transition-colors">DPI Architecture & Specs</Link></li>
            </ul>
          </div>

          {/* Col 3: Official Heritage References */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Primary Sourcing</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="https://www.indianculture.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>Indian Culture Portal</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://www.abhilekhpatal.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>National Archives (Abhilekh-Patal)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://pib.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>PIB Freedom Archives</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>Wikimedia Commons (CC Licenses)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Unsung Heroes of India. Curated text & metadata under CC-BY 4.0.</p>
          <div className="flex items-center gap-2">
            <span>Built for the people of India as an Open Cultural Public Asset</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
