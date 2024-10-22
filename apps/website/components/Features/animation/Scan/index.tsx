'use client';
import { RefObject, useEffect, useRef } from 'react';
import styles from './style.module.scss';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type ScanProps = {
  triggerRef: RefObject<HTMLDivElement>;
};

export default function Scan({ triggerRef }: ScanProps) {
  const mainRef = useRef(null);
  const glowingLine = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lineAnimation = gsap.to(glowingLine.current, {
      top: '100%',
      duration: 3,
      ease: 'power1.out',
      paused: true,
    });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to(mainRef.current, {
            width: '100%',
            height: '100%',
            opacity: 1,
            duration: 0.5,
          });
          lineAnimation.restart();
        },
        onEnterBack: () => {
          gsap.to(mainRef.current, {
            width: '100%',
            height: '100%',
            opacity: 1,
            duration: 0.5,
          });
          lineAnimation.restart();
        },
        onLeave: () => {
          gsap.to(mainRef.current, {
            width: '0',
            height: '0',
            opacity: 0,
            duration: 0.5,
          });
          lineAnimation.pause();
        },
        onLeaveBack: () => {
          gsap.to(mainRef.current, {
            width: '0',
            height: '0',
            opacity: 0,
            duration: 0.5,
          });
          lineAnimation.pause();
        },
      });
    });

    mm.add('(max-width: 769px)', () => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => {
          gsap.to(mainRef.current, {
            width: '100%',
            height: '100%',
            opacity: 1,
            duration: 0.5,
          });
          lineAnimation.restart();
        },
        onEnterBack: () => {
          gsap.to(mainRef.current, {
            width: '100%',
            height: '100%',
            opacity: 1,
            duration: 0.5,
          });
          lineAnimation.restart();
        },
        onLeave: () => {
          gsap.to(mainRef.current, {
            width: '0',
            height: '0',
            opacity: 0,
            duration: 0.5,
          });
          lineAnimation.pause();
        },
        onLeaveBack: () => {
          gsap.to(mainRef.current, {
            width: '0',
            height: '0',
            opacity: 0,
            duration: 0.5,
          });
          lineAnimation.pause();
        },
      });
    });

    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, [triggerRef]);

  return (
    <div ref={mainRef} className={styles.main}>
      <Image
        src="\homemade-Receipt.svg"
        alt="Receipt"
        width={450}
        height={900}
        quality={80}
        priority
      />
      <div className={styles['glowing-line']} ref={glowingLine}></div>
    </div>
  );
}
