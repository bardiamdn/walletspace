'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function CurvedScroll() {
  const textRef = useRef(null);

  useEffect(() => {
    gsap.to(textRef.current, {
      scrollTrigger: {
        trigger: textRef.current,
        scrub: true,
        start: 'top bottom',
        end: 'bottom top',
      },
      motionPath: {
        path: 'M250,0 C150,100 350,300 250,400',
        align: 'self', // Aligns the element to the path
        alignOrigin: [0.5, 0.5], // Center alignment
        autoRotate: false, // Disable auto-rotation
      },
    });
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div style={{ height: '200vh', padding: '50px' }}>
        {/* SVG Path */}
        <svg
          width="500"
          height="500"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <path
            d="M250,0 C150,100 350,300 250,400"
            stroke="gray"
            fill="none"
            strokeWidth="2"
          />
        </svg>

        {/* Text to Animate */}
        <div
          ref={textRef}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            fontSize: '24px',
            background: 'yellow',
          }}
        >
          Scroll Me!
        </div>
      </div>
    </div>
  );
}
