'use client';
import { RefObject, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import styles from './style.module.scss';

type CreateProps = {
  triggerRef: RefObject<HTMLDivElement>;
};

export default function Create({ triggerRef }: CreateProps) {
  const [animationState, setAnimationState] = useState<
    'Enter' | 'EnterBack' | 'Leave' | 'LeaveBack' | null
  >(null);
  const mainRef = useRef(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeRef = useRef(0);

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

    mm.add('(max-width: 769px)', () => {
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
    if (animationState === 'EnterBack' || animationState === 'Enter') {
      gsap.set(
        mainRef.current,
        animationState === 'Enter'
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
    } else {
      gsap.to(mainRef.current, {
        left: animationState === 'Leave' ? '-100%' : '50%',
        width: animationState === 'Leave' ? '70%' : 0,
        height: animationState === 'Leave' ? '70%' : 0,
        opacity: animationState === 'Leave' ? 1 : 0,
        duration: 0.5,
        onComplete: () => {
          setAnimationState(null);
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
