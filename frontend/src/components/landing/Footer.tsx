'use client';

import { Activity } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-500">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">
                Activity<span className="text-primary">Monitor</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Real-time activity monitoring for modern applications. Track, analyze, and 
              respond to every event instantly.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Product</h3>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'API', 'Documentation'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ActivityMonitor. All rights reserved. Assessment for Decyfotech🔵
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Privacy Policy.  Eboagoro Jahdiebube Delight
              </a>
              <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}