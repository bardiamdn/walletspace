'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MediaQueryProvider } from '../context/MediaQueryContext';

export default function Index() {
  const scrollRef = useRef(null);

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;
      const locoScroll = new LocomotiveScroll();
    })();

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      '.main',
      {
        // y: 20,
        opacity: 0,
      },
      {
        // y: 0,
        opacity: 1,
        duration: 0.25,
        ease: 'power2.in',
      }
    );

    window.scrollTo(0, 0);
  }, []);

  return (
    <MediaQueryProvider>
      <main
        ref={scrollRef}
        className="flex flex-col items-center main"
        data-scroll-container
      >
        <Header />
        <Hero />
        <Features />
        <Footer />
      </main>
    </MediaQueryProvider>
  );
}
