'use client';

import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { cn } from '@/src/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, type, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-foreground/80">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors duration-200',
            'hover:border-primary/50',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

interface PasswordInputProps extends Omit<InputProps, 'type'> {
  showToggle?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-1.5">
        {props.label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-foreground/80">
            {props.label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={props.id}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors duration-200',
              'hover:border-primary/50',
              'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
              props.error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
              className,
            )}
            {...props}
          />
          {showToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {props.error && <p className="text-xs text-destructive">{props.error}</p>}
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export { Input, PasswordInput };