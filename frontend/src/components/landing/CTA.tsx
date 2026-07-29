'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/src/components/ui/Button';

export function CTA() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-purple-600 to-pink-600 p-12 text-center text-white shadow-2xl sm:p-16"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
              Join thousands of teams already monitoring their applications in real-time.
              Start your free trial today.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/register">
                    <Button
                        size="lg"
                        className="group h-14 px-8 text-base font-semibold bg-primary text-white hover:bg-primary/90 dark:bg-white dark:text-primary dark:hover:bg-white/90 shadow-xl transition-all duration-300"
                    >
                        Start Free Trial

                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}