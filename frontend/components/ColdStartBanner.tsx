'use client';

import { useState, useEffect } from 'react';
import { Server, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ColdStartBanner() {
  const [isServerAwake, setIsServerAwake] = useState<boolean | null>(null);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
    const checkHealth = async () => {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`${API_BASE.replace('/api/v1', '')}/health`, {
          signal: controller.signal,
        });
        clearTimeout(id);
        setIsServerAwake(res.ok);
      } catch (e) {
        setIsServerAwake(false);
      }
    };
    checkHealth();
  }, []);

  if (isServerAwake === null || isServerAwake === true) return null;

  return (
    <div className="bg-saffron-950/40 border-b border-saffron-500/20 px-4 py-2 text-xs text-saffron-300 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron-500"></span>
          </span>
          <span>
            <strong className="text-white">Edge Caching Active:</strong> Sovereign compute node is currently warming up. Browsing and cached catalog items are instant.
          </span>
        </div>
      </div>
    </div>
  );
}
