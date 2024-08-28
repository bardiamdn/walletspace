'use client';
import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function Index() {
  const scrollRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      '.page-container',
      {
        // y: 20,
        opacity: 0,
      },
      {
        // y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.in',
      }
    );
    window.scrollTo(0, 0);
  });
  return (
    <div ref={scrollRef} className="flex flex-col items-center page-container">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
