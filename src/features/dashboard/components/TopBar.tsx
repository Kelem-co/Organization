import React from 'react';
import { Bell, Search, Plus, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

interface TopBarProps {
  title: string;
  onAction?: () => void;
  actionLabel?: string;
  showSearch?: boolean;
  onMenuClick?: () => void;
}

export default function TopBar({ title, onAction, actionLabel, showSearch = true, onMenuClick }: TopBarProps) {
  return (
    <header className="h-20 bg-white border-b border-outline-variant px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 min-w-0">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-primary-navy rounded-lg hover:bg-surface-container transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-sm lg:text-lg font-bold text-primary-navy truncate uppercase tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-2 lg:gap-6 ml-auto shrink-0">
        {showSearch && (
          <div className="relative hidden md:block w-48 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-navy/40" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-navy/20"
            />
          </div>
        )}

        <button className="p-2 text-primary-navy/60 hover:bg-surface-container rounded-lg relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {onAction && actionLabel && (
          <button 
            onClick={onAction}
            className="bg-primary-navy text-white px-3 lg:px-5 py-2 lg:py-2.5 rounded-lg flex items-center gap-2 font-bold text-[10px] lg:text-sm uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{actionLabel}</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>
    </header>
  );
}
