'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './style.module.scss';
import Submit from '../../../common/Submit';
import { useMediaQuery } from '../../../context/MediaQueryContext';
import { useAnimationContext } from '../../../context/AnimationContext';

type FormProps = {
  desktopSectionRef: RefObject<HTMLFormElement>;
  mobileSectionRef: RefObject<HTMLFormElement>;
  // placeholderRef: RefObject<HTMLFormElement>;
  containerRef: RefObject<HTMLFormElement>;
  titlesSectionRef: RefObject<HTMLFormElement>;
  descriptionsSectionRef: RefObject<HTMLFormElement>;
};

export default function Form({
  desktopSectionRef,
  mobileSectionRef,
  // placeholderRef,
  containerRef,
  titlesSectionRef,
  descriptionsSectionRef,
}: FormProps) {
  const { animationState, setAnimationState } = useAnimationContext();
  const { isMobile } = useMediaQuery();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const formInputRef = useRef<HTMLInputElement>(null);
  const earlyAccessRef = useRef<HTMLButtonElement>(null);

  const waitlistUrl = process.env
    .NEXT_PUBLIC_WAITLIST_HANDLER_URL as RequestInfo;

  const handleSubmit = async (event: React.FormEvent) => {
    console.log(waitlistUrl); // BIZAT
    event.preventDefault();

    const email = formInputRef.current?.value;
    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(waitlistUrl, {
        // mode: 'no-cors',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      console.log(response.body); // BIZAT

      if (!response.ok) {
        throw new Error('Failed to submit email. Please try again.');
      }

      formInputRef.current.value = '';
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isMobile) {
      ScrollTrigger.create({
        trigger: desktopSectionRef.current,
        start: 'top center',
        end: 'bottom 60%',
        // markers: true,
        onEnter: () => {
          setAnimationState('form-scanEnter');
        },
        onEnterBack: () => {
          setAnimationState('form-manageEnterBack');
        },
        onLeave: () => {
          setAnimationState('form-manageLeave');
        },
        onLeaveBack: () => {
          setAnimationState('form-scanLeaveBack');
        },
      });
    } else {
      ScrollTrigger.create({
        trigger: mobileSectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        pin: true,
        onEnter: () => {
          setAnimationState('form-scanEnter');
        },
        onEnterBack: () => {
          setAnimationState('form-manageEnterBack');
        },
        onLeave: () => {
          setAnimationState('form-manageLeave');
        },
        onLeaveBack: () => {
          setAnimationState('form-scanLeaveBack');
        },
        onUpdate: (self) => {
          const scrollProgress = self.progress;
          gsap.to(titlesSectionRef.current, {
            scrollTop: scrollProgress * 300,
          });
          gsap.to(descriptionsSectionRef.current, {
            scrollTop: scrollProgress * 300,
          });
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [
    desktopSectionRef,
    mobileSectionRef,
    containerRef,
    titlesSectionRef,
    descriptionsSectionRef,
    isMobile,
    setAnimationState,
  ]);

  useEffect(() => {
    if (
      (animationState === 'form-manageLeave' ||
        animationState === 'form-scanLeaveBack') &&
      !isMobile
    ) {
      gsap.set(formRef.current, { display: 'flex' });
      gsap.to(containerRef.current, {
        height: '100px',
        width: '100%',
        transform:
          animationState === 'form-manageLeave'
            ? 'translateY(0)'
            : 'translateY(-35vh)',
        duration: 0.5,
        delay: 0.2,
        ease: 'power2.inOut',
      });
      gsap.to(formRef.current, {
        opacity: 1,
        width: '100%',
        height: '100%',
        duration: 0.3,
        ease: 'power2.in',
      });
    } else if (
      (animationState === 'form-manageLeave' ||
        animationState === 'form-scanLeaveBack') &&
      isMobile
    ) {
      gsap.set(formRef.current, { display: 'flex' });
      gsap.to(containerRef.current, {
        height: '100px',
        width: '100%',
        transform:
          animationState === 'form-manageLeave'
            ? 'translateY(45vh)'
            : 'translateY(-20vh)',
        duration: 0.5,
        delay: 0.2,
        ease: 'power2.inOut',
      });
      gsap.to(formRef.current, {
        opacity: 1,
        width: '100%',
        height: '100%',
        duration: 0.3,
        ease: 'power2.in',
      });
    } else if (
      animationState === 'form-scanEnter' ||
      animationState === 'form-manageEnterBack'
    ) {
      gsap.to(formRef.current, {
        opacity: 0,
        width: 0,
        height: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
      gsap.to(containerRef.current, {
        height: isMobile ? '100%' : '600px',
        width: '100%',
        transform: isMobile ? 'translateY(0)' : 'translateY(-50%)',
        duration: 0.5,
        delay: 0.2,
        ease: 'power2.inOut',
      });
      gsap.set(formRef.current, { display: 'none' });
    }
  }, [containerRef, isMobile, animationState]);

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        className={styles.input}
        aria-label="Email"
        required
        ref={formInputRef}
      />
      <Submit
        className={styles.button}
        ref={earlyAccessRef}
        disabled={isLoading}
        loading={isLoading}
        error={error ? error : undefined}
      >
        Early Access
      </Submit>
      {/* {error && <p className={styles.error}>{error}</p>} */}
    </form>
  );
}
