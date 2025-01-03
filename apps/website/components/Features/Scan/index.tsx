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
  const mainRef = useRef(null);
  const containerRef = useRef(null);

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

  // useEffect(() => {
  //   // image dimensions update funciton
  //   const updateDimensions = () => {
  //     if (containerRef.current) {
  //       const { clientWidth, clientHeight } = containerRef.current;
  //       setDimensions({
  //         width: clientWidth * 0.8,
  //         height: clientHeight * 0.5,
  //       });
  //     }
  //   };

  //   updateDimensions();
  //   window.addEventListener('resize', updateDimensions);

  //   return () => window.removeEventListener('resize', updateDimensions);
  // }, []);

  return (
    <div ref={mainRef} className={styles.main}>
      <div className={styles.container} ref={containerRef}></div>
    </div>
  );
}
