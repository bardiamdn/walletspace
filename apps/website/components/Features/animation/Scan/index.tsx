'use client';
import { RefObject, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import styles from './style.module.scss';

type ScanProps = {
  triggerRef: RefObject<HTMLDivElement>;
};

export default function Scan({ triggerRef }: ScanProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mainRef = useRef(null);
  const containerRef = useRef(null);
  const blurRef = useRef(null);
  const glowingLineRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const lineAnimation = gsap.to(glowingLineRef.current, {
      top: '100%',
      duration: 3,
      ease: 'power1.out',
      delay: 0.3,
      paused: true,
    });

    const capture = gsap.timeline({
      paused: true,
    });

    capture
      .to(blurRef.current, {
        opacity: 0.5,
        duration: 0.5,
        ease: 'power4.in',
      })
      .to(blurRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power4.in',
      })
      .to(blurRef.current, {
        opacity: 0.4,
        duration: 0.5,
        ease: 'power4.in',
      })
      .to(blurRef.current, {
        delay: 0.5,
        opacity: 1,
        duration: 0.1,
        ease: 'power4.in',
      })
      .to(blurRef.current, {
        opacity: 0.3,
        duration: 0.1,
        ease: 'power2.out',
      })
      .to(blurRef.current, {
        opacity: 0,
        duration: 0.1,
        ease: 'power2.inOut',
      });
    // .to(glowingLineRef.current, {
    //   top: '100%',
    //   duration: 3,
    //   ease: 'power1.inOut',
    //   delay: 0.3,
    // });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setIsOpen(true);
          capture.restart();
          // lineAnimation.restart();
        },
        onEnterBack: () => {
          setIsOpen(true);
          capture.restart();
          // lineAnimation.restart();
        },
        onLeave: () => {
          capture.pause();
          // lineAnimation.pause();
          setIsOpen(false);
        },
        onLeaveBack: () => {
          capture.pause();
          // lineAnimation.pause();
          setIsOpen(false);
        },
      });
    });

    mm.add('(max-width: 768px)', () => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => {
          setIsOpen(true);
          lineAnimation.restart();
        },
        onEnterBack: () => {
          setIsOpen(true);
          lineAnimation.restart();
        },
        onLeave: () => {
          lineAnimation.pause();
          setIsOpen(false);
        },
        onLeaveBack: () => {
          lineAnimation.pause();
          setIsOpen(false);
        },
      });
    });

    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
      mm.revert();
    };
  }, [triggerRef, containerRef, glowingLineRef]);

  useEffect(() => {
    if (isOpen) {
      gsap.set(mainRef.current, { display: 'flex' });
      gsap.fromTo(
        mainRef.current,
        {
          width: '70%',
          height: '70%',
          left: '100%',
        },
        {
          width: '100%',
          height: '100%',
          left: 0,
          // opacity: 1,
          duration: 0.5,
          // delay: 0.2,
          ease: 'power1.inOut',
        }
      );
    } else {
      gsap.to(mainRef.current, {
        width: '70%',
        height: '70%',
        left: '-100%',
        // opacity: 0.5,
        duration: 0.5,
        // delay: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(mainRef.current, { display: 'none' });
        },
      });
    }
  }, [isOpen]);

  useEffect(() => {
    // image dimensions update funciton
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth * 0.8,
          height: clientHeight * 0.5,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div ref={mainRef} className={styles.main}>
      <div className={styles.container} ref={containerRef}>
        <Image
          src="\receipt.svg"
          alt="Receipt"
          width={dimensions.width}
          height={dimensions.height}
          className={styles.receipt}
          priority
        />
        <div className={styles.blur} ref={blurRef}></div>
        <div className={styles['glowing-line']} ref={glowingLineRef}></div>
        <div className={styles.ring}></div>
      </div>
    </div>
  );
}
