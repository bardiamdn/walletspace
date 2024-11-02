'use client';
import { RefObject, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import styles from './style.module.scss';
import { useAnimationContext } from '../../../context/AnimationContext';
import { useMediaQuery } from '../../../context/MediaQueryContext';

type CreateProps = {
  triggerRef: RefObject<HTMLDivElement>;
};

export default function Create({ triggerRef }: CreateProps) {
  const { animationState, setAnimationState } = useAnimationContext();
  const { isMobile } = useMediaQuery();
  const mainRef = useRef(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isMobile) {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setAnimationState('spaceLeave-manageEnter');
        },
        onEnterBack: () => {
          setAnimationState('form-manageEnterBack');
        },
        onLeave: () => {
          setAnimationState('form-manageLeave');
        },
        onLeaveBack: () => {
          setAnimationState('spaceEnterBack-manageLeaveback');
        },
      });
    } else {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => {
          setAnimationState('spaceLeave-manageEnter');
        },
        onEnterBack: () => {
          setAnimationState('form-manageEnterBack');
        },
        onLeave: () => {
          setAnimationState('form-manageLeave');
        },
        onLeaveBack: () => {
          setAnimationState('spaceEnterBack-manageLeaveback');
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
      animationState === 'spaceLeave-manageEnter' ||
      animationState === 'form-manageEnterBack'
    ) {
      gsap.set(
        mainRef.current,
        animationState === 'spaceLeave-manageEnter'
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
    } else if (
      animationState === 'form-manageLeave' ||
      animationState === 'spaceEnterBack-manageLeaveback'
    ) {
      gsap.to(mainRef.current, {
        left: animationState === 'form-manageLeave' ? '50%' : '-100%',
        width: animationState === 'form-manageLeave' ? 0 : '70%',
        height: animationState === 'form-manageLeave' ? 0 : '70%',
        opacity: animationState === 'form-manageLeave' ? 0 : 1,
        duration: 0.5,
        onComplete: () => {
          gsap.set(mainRef.current, {
            display: 'none',
          });
        },
      });
    }

    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvas) return;

    const width = (canvas.width =
      typeof canvas.parentElement?.clientWidth === 'number' &&
      canvas.parentElement?.clientWidth > 50
        ? canvas.parentElement?.clientWidth
        : 200);
    const height = (canvas.height = 200);
    const amplitude = 50;
    const frequency = 0.02;
    const yOffset = height / 2;

    let time = 0;

    const drawGraph = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = '#3d3d3d';
      ctx.lineWidth = 5;

      ctx.beginPath();
      ctx.moveTo(0, yOffset);

      for (let x = 0; x < width; x++) {
        const y = Math.sin((x + time) * frequency) * amplitude + yOffset;
        ctx.lineTo(x, y);
      }

      ctx.stroke();

      const circleX = width;
      const circleY =
        Math.sin((circleX + time) * frequency) * amplitude + yOffset;
      const circleRadius = 15;

      ctx.beginPath();
      ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#3d3d3d';
      ctx.fill();

      time += 2;

      requestAnimationFrame(drawGraph);
    };

    drawGraph();
  }, [animationState]);

  return (
    <div ref={mainRef} className={styles.main}>
      <canvas ref={canvasRef} />
    </div>
  );
}
