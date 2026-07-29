'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CTO, TechStart Inc.',
    content:
      'ActivityMonitor transformed how we track our application events. The real-time feed is incredibly responsive and the dashboard is beautiful.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Lead Developer, DataFlow',
    content:
      'The WebSocket integration is flawless. We can now monitor thousands of events per second with zero lag. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Product Manager, CloudScale',
    content:
      'Setting up was a breeze. Within minutes we had our first events streaming. The notification system is a game-changer for our team.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Loved by{' '}
            <span className="gradient-text">Teams</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            See what our customers have to say about their experience.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500 text-sm font-semibold text-white">
                  {testimonial.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <div className="text-sm font-semibold">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}