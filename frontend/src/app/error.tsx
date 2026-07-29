'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '@/src/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-destructive/10">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>

        <h1 className="mb-2 text-3xl font-bold">Something went wrong</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} icon={<RefreshCw className="h-4 w-4" />}>
          Try Again
        </Button>
      </motion.div>
    </div>
  );
}