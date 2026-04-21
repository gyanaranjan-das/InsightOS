'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ActivitySquare, Funnel, Sparkles, Settings, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Events', href: '/events', icon: ActivitySquare },
  { name: 'Funnels', href: '/funnels', icon: Funnel },
  { name: 'AI Insights', href: '/ai', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 hidden flex-col border-r border-slate-200 bg-white sm:flex dark:border-slate-800 dark:bg-slate-950 transition-transform">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Activity className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="ml-3 text-lg font-bold tracking-tight">InsightOS</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive ? 'text-primary' : '')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-sm font-semibold text-primary">Pro Plan Active</h4>
            <p className="text-xs text-muted-foreground mt-1 mb-3">14.2k / 50k events</p>
            <div className="h-1.5 w-full rounded-full bg-primary/20">
              <div className="h-full rounded-full bg-primary" style={{ width: '28%' }} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
