'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { cn } from '@/src/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground',
        className,
      )}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}