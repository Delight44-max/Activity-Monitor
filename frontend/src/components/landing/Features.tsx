'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Bell,
  BarChart3,
  Shield,
  Zap,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Real-Time Monitoring',
    description:
      'Watch events appear instantly as they happen with WebSocket-powered live updates.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    description:
      'Get notified immediately when important events occur with in-app notifications.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Beautiful Analytics',
    description:
      'Visualize your data with stunning charts, graphs, and statistical overviews.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description:
      'Enterprise-grade security with JWT authentication and encrypted data transmission.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Optimized for performance with sub-50ms latency and 99.9% uptime guarantee.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Share dashboards and collaborate with your team in real-time.',
    color: 'from-indigo-500 to-purple-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Everything You Need to{' '}
            <span className="gradient-text">Monitor</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Powerful features designed to give you complete visibility into your application's activity.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div
                className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3 text-white shadow-lg`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}