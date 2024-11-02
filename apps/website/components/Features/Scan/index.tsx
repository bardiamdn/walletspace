'use client';
import { RefObject, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import classNames from 'classnames';

import styles from './style.module.scss';
import { useAnimationContext } from '../../../context/AnimationContext';
import { useMediaQuery } from '../../../context/MediaQueryContext';

type ScanProps = {
  triggerRef: RefObject<HTMLDivElement>;
};

const items = [
  { name: 'Chips', price: '10.2' },
  { name: 'Cookies', price: '10.2' },
  { name: 'Oranges', price: '10.2' },
  { name: 'Tea', price: '10.2' },
  { name: 'Milk', price: '10.2' },
  { name: 'Egg', price: '10.2' },
];

export default function Scan({ triggerRef }: ScanProps) {
  const { animationState, setAnimationState } = useAnimationContext();
  const { isMobile } = useMediaQuery();
  const mainRef = useRef(null);
  const containerRef = useRef(null);
  const blurRef = useRef(null);
  const glowingLineRef = useRef(null);
  const collectionRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const capture = gsap.timeline({
      paused: true,
      repeat: -1,
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
      })
      .to(
        glowingLineRef.current,
        {
          top: '0',
          duration: 3,
          ease: 'power3.inOut',
          // onComplete: () => {
          //   gsap.set(glowingLineRef.current, {
          //     borderBottom: 'none',
          //     boxShadow: 'none',
          //   });
          // },
        },
        '<'
      )
      .to(
        collectionRef.current,
        {
          top: '0',
          duration: 3,
          ease: 'power3.inOut',
        },
        '<'
      );

    if (!isMobile) {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setAnimationState('form-scanEnter');
          capture.restart();
        },
        onEnterBack: () => {
          setAnimationState('scanEnterBack-spaceLeaveBack');
          capture.restart();
        },
        onLeave: () => {
          setAnimationState('scanLeave-spaceEnter');
          capture.pause();
        },
        onLeaveBack: () => {
          setAnimationState('form-scanLeaveBack');
          capture.pause();
        },
      });
    } else {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => {
          setAnimationState('form-scanEnter');
          capture.restart();
        },
        onEnterBack: () => {
          setAnimationState('scanEnterBack-spaceLeaveBack');
          capture.restart();
        },
        onLeave: () => {
          setAnimationState('scanLeave-spaceEnter');
          capture.pause();
        },
        onLeaveBack: () => {
          setAnimationState('form-scanLeaveBack');
          capture.pause();
        },
      });
    }

    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, [triggerRef, setAnimationState, isMobile]);

  useEffect(() => {
    if (
      animationState === 'form-scanEnter' ||
      animationState === 'scanEnterBack-spaceLeaveBack'
    ) {
      gsap.set(
        mainRef.current,
        animationState === 'form-scanEnter'
          ? {
              display: 'flex',
              width: 0,
              height: 0,
              left: '50%',
              opacity: 0,
            }
          : {
              display: 'flex',
              width: '70%',
              height: '70%',
              left: '100%',
              opacity: 1,
            }
      );
      gsap.to(mainRef.current, {
        width: '100%',
        height: '100%',
        left: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power1.inOut',
      });
    } else if (
      animationState === 'scanLeave-spaceEnter' ||
      animationState === 'form-scanLeaveBack'
    ) {
      gsap.to(mainRef.current, {
        left: animationState === 'scanLeave-spaceEnter' ? '-100%' : '50%',
        width: animationState === 'scanLeave-spaceEnter' ? '70%' : 0,
        height: animationState === 'scanLeave-spaceEnter' ? '70%' : 0,
        opacity: animationState === 'scanLeave-spaceEnter' ? 1 : 0,
        duration: 0.5,
        onComplete: () => {
          gsap.set(mainRef.current, {
            display: 'none',
          });
        },
      });
    }
  }, [animationState]);

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
        <image className={styles.receipt} />
        <div className={styles.blur} ref={blurRef}></div>
        <div className={styles['glowing-line']} ref={glowingLineRef}>
          <div className={styles.collection} ref={collectionRef}>
            {/* {items.map((item, index) => (
              <div key={index} className={styles.items}>
                <span>{item.name}</span>
                <span>{item.price}</span>
              </div>
            ))} */}
            <div className={styles.items}>
              <span>Oranges</span>
              <span>16</span>
            </div>
            <div className={styles.items}>
              <span>Milk</span>
              <span>13.5</span>
            </div>
            <div className={styles.items}>
              <span>Cookies</span>
              <span>14.6</span>
            </div>
            <div className={styles.items}>
              <span>Tea</span>
              <span>17.5</span>
            </div>
            <div className={styles.items}>
              <span>Chips</span>
              <span>11.7</span>
            </div>
            <div className={styles.items}>
              <span>Eggs</span>
              <span>4.5</span>
            </div>
            <div
              className={classNames(
                styles.items,
                'font-extrabold text-xl border-8 border-slate-800 mt-8'
              )}
            >
              <span>Total</span>
              <span>60.3</span>
            </div>
          </div>
        </div>
        <div className={styles.ring}></div>
      </div>
    </div>
  );
}
