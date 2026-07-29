'use client';

import { type ReactNode } from 'react';
import { cn } from '@/src/lib/utils';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-12 text-center',
        className,
      )}
    >
      <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
        {icon || <Inbox className="h-8 w-8" />}
      </div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action}
    </div>
  );
}