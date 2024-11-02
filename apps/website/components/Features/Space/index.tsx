'use client';
import { RefObject, useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMediaQuery } from '../../../context/MediaQueryContext';
import { useAnimationContext } from '../../../context/AnimationContext';

type SpaceProps = {
  triggerRef: RefObject<HTMLDivElement>;
};

export default function Space({ triggerRef }: SpaceProps) {
  const { animationState, setAnimationState } = useAnimationContext();
  const isMobile = useMediaQuery();
  const mainRef = useRef(null);

  useEffect(() => {
    if (
      animationState === 'scanLeave-spaceEnter' ||
      animationState === 'spaceEnterBack-manageLeaveback'
    ) {
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
    } else if (
      animationState === 'spaceLeave-manageEnter' ||
      animationState === 'scanEnterBack-spaceLeaveBack'
    ) {
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
  }, [animationState]);

  useEffect(() => {
    if (isMobile) {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setAnimationState('scanLeave-spaceEnter');
        },
        onEnterBack: () => {
          setAnimationState('spaceEnterBack-manageLeaveback');
        },
        onLeave: () => {
          setAnimationState('spaceLeave-manageEnter');
        },
        onLeaveBack: () => {
          setAnimationState('scanEnterBack-spaceLeaveBack');
        },
      });
    } else {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => {
          setAnimationState('scanLeave-spaceEnter');
        },
        onEnterBack: () => {
          setAnimationState('spaceEnterBack-manageLeaveback');
        },
        onLeave: () => {
          setAnimationState('spaceLeave-manageEnter');
        },
        onLeaveBack: () => {
          setAnimationState('scanEnterBack-spaceLeaveBack');
        },
      });
    }

    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, [triggerRef, isMobile, setAnimationState]);

  return (
    <div ref={mainRef} className={styles.main}>
      <h1>Space animation placeholder</h1>
    </div>
  );
}
