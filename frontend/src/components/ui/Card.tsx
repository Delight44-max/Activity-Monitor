'use client';

import { type ReactNode } from 'react';
import { cn } from '@/src/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export function Card({ children, className, hover = false, glass = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-6 shadow-sm',
        hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        glass && 'glass-card',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(className)}>{children}</div>;
}