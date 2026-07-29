'use client';

import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { Features } from './Features';
import { Testimonials } from './Testimonials';
import { CTA } from './CTA';
import { Contact } from './Contact';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <Contact />
      <Footer />
    </div>
  );
}