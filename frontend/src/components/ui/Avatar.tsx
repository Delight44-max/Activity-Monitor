'use client';

import { cn } from '@/src/lib/utils';

interface AvatarProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ firstName, lastName, size = 'md', className }: AvatarProps) {
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500 font-semibold text-white',
        sizes[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}