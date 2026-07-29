'use client';

import { motion } from 'framer-motion';
import { Activity, Home } from 'lucide-react';
import Link from 'next/link';
import Button from '@/src/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-purple-500 shadow-2xl"
        >
          <Activity className="h-12 w-12 text-white" />
        </motion.div>

        <h1 className="mb-2 text-8xl font-bold">
          <span className="gradient-text">404</span>
        </h1>
        <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button icon={<Home className="h-4 w-4" />}>Back to Home</Button>
        </Link>
      </motion.div>
    </div>
  );
}