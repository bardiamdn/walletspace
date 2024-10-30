'use client';
import { RefObject, useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type SpaceProps = {
  triggerRef: RefObject<HTMLDivElement>;
};

export default function Space({ triggerRef }: SpaceProps) {
  const [animationState, setAnimationState] = useState<
    'Enter' | 'EnterBack' | 'Leave' | 'LeaveBack' | null
  >(null);
  const mainRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setAnimationState('Enter');
        },
        onEnterBack: () => {
          setAnimationState('EnterBack');
        },
        onLeave: () => {
          setAnimationState('Leave');
        },
        onLeaveBack: () => {
          setAnimationState('LeaveBack');
        },
      });
    });

    mm.add('(max-width: 768px)', () => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => {
          setAnimationState('Enter');
        },
        onEnterBack: () => {
          setAnimationState('EnterBack');
        },
        onLeave: () => {
          setAnimationState('Leave');
        },
        onLeaveBack: () => {
          setAnimationState('LeaveBack');
        },
      });
    });

    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
      mm.revert();
    };
  }, [triggerRef]);

  useEffect(() => {
    if (animationState === 'Enter' || animationState === 'EnterBack') {
      gsap.set(
        mainRef.current,
        animationState === 'Enter'
          ? {
              display: 'flex',
              width: '70%',
              height: '70%',
              left: '100%',
              opacity: 1,
            }
          : {
              display: 'flex',
              width: 0,
              height: 0,
              left: '50%',
              opacity: 0,
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
    } else {
      gsap.to(mainRef.current, {
        left: animationState === 'Leave' ? '50%' : '-100%',
        width: animationState === 'Leave' ? 0 : '70%',
        height: animationState === 'Leave' ? 0 : '70%',
        opacity: animationState === 'Leave' ? 0 : 1,
        duration: 0.5,
        onComplete: () => {
          setAnimationState(null);
          gsap.set(mainRef.current, {
            display: 'none',
          });
        },
      });
    }
  }, [animationState]);

  return (
    <div ref={mainRef} className={styles.main}>
      <h1>Space animation placeholder</h1>
    </div>
  );
}
