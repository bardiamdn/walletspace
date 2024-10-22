'use client';
import { RefObject, useEffect, useRef } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type SpaceProps = {
  triggerRef: RefObject<HTMLDivElement>;
};

export default function Space({ triggerRef }: SpaceProps) {
  const mainRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

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
        },
        onEnterBack: () => {
          gsap.to(mainRef.current, {
            width: '100%',
            height: '100%',
            opacity: 1,
            duration: 0.5,
          });
        },
        onLeave: () => {
          gsap.to(mainRef.current, {
            width: '0',
            height: '0',
            opacity: 0,
            duration: 0.5,
          });
        },
        onLeaveBack: () => {
          gsap.to(mainRef.current, {
            width: '0',
            height: '0',
            opacity: 0,
            duration: 0.5,
          });
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
        },
        onEnterBack: () => {
          gsap.to(mainRef.current, {
            width: '100%',
            height: '100%',
            opacity: 1,
            duration: 0.5,
          });
        },
        onLeave: () => {
          gsap.to(mainRef.current, {
            width: '0',
            height: '0',
            opacity: 0,
            duration: 0.5,
          });
        },
        onLeaveBack: () => {
          gsap.to(mainRef.current, {
            width: '0',
            height: '0',
            opacity: 0,
            duration: 0.5,
          });
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
      <h1>Space animation placeholder</h1>
    </div>
  );
}
