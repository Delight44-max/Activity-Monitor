'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Input } from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';

export function Contact() {
  return (
    <section id="contact" className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Get in{' '}
            <span className="gradient-text">Touch</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Have questions? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">Assesment@activitymonitor.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-sm text-muted-foreground">+234 8158869243</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-sm text-muted-foreground">Lagos State, Lagos Nigeria</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="First Name" placeholder="John" id="contact-first" />
              <Input label="Last Name" placeholder="Doe" id="contact-last" />
            </div>
            <Input label="Email" type="email" placeholder="john@example.com" id="contact-email" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground/80">Message</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors duration-200 hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Tell us about your project..."
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}