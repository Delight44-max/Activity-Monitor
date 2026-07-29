'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Activity, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import Button from '@/src/components/ui/Button';

const floatingIcons = [
  { Icon: Activity, x: '15%', y: '20%', delay: 0, color: 'text-blue-500' },
  { Icon: Zap, x: '80%', y: '30%', delay: 0.5, color: 'text-yellow-500' },
  { Icon: Shield, x: '70%', y: '70%', delay: 1, color: 'text-green-500' },
];

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
        <div className="animate-aurora absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="animate-aurora absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" style={{ animationDelay: '-5s' }} />
        <div className="animate-aurora absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-3xl" style={{ animationDelay: '-10s' }} />
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, x, y, delay, color }) => (
        <motion.div
          key={color}
          className={`absolute hidden lg:block ${color}`}
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/60 shadow-lg backdrop-blur-xl dark:bg-slate-800/60">
              <Icon className="h-7 w-7" />
            </div>
          </motion.div>
        </motion.div>
      ))}

      <div className="container mx-auto flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Real-Time Activity Monitoring
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Monitor Your App's{' '}
          <span className="gradient-text">Activity</span>{' '}
          in Real-Time
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Track, analyze, and respond to every event in your application instantly.
          Beautiful dashboards, real-time updates, and powerful insights at your fingertips.
        </motion.p>
          {/* Buttons */}

          <motion.div

              initial={{
                  opacity:0,
                  y:20
              }}

              animate={{
                  opacity:1,
                  y:0
              }}

              transition={{
                  delay:.3
              }}

              className="mt-10 flex flex-col gap-4 sm:flex-row"

          >

              <Link href="/register">

                  <Button
                      size="lg"
                      className="group h-14 px-8 text-base shadow-xl"
                  >

                      Start Free Trial

                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />

                  </Button>

              </Link>


              <Link href="#features">

                  <Button
                      variant="outline"
                      size="lg"
                      className="h-14 px-8 text-base backdrop-blur"
                  >

                      Explore Features

                  </Button>

              </Link>


          </motion.div>

      </div>
    </section>
  );
}