'use client';
import classNames from 'classnames';
import gsap from 'gsap';
import styles from './style.module.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';

export default function Index() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subTitleRef = useRef(null);

  const subtitle =
    'Easily track and manage your spendings through a common space';

  useLayoutEffect(() => {
    // section loading animation
    gsap.fromTo(
      heroRef.current,
      {
        y: 20,
      },
      {
        y: 0,
        duration: 0.5,

        ease: 'power2.in',
      }
    );

    // individual loading animation
    gsap.fromTo(
      titleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.inOut' }
    );
    gsap.fromTo(
      subTitleRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.inOut' }
    );

    return () => {
      // Cleanup ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  });

  return (
    <div className={styles.heroContainer} ref={heroRef} data-scroll-section>
      <div className={classNames(styles.leftVisual)}></div>
      <section className={styles.ctaContainer}>
        <div className={styles.titles}></div>
        <h1
          ref={titleRef}
          className={classNames(styles.header)}
          data-scroll
          data-scroll-speed="0.3"
        >
          Manage Your Shared Finance
        </h1>
        <div className={styles.subtitles}></div>
        <h4
          ref={subTitleRef}
          className={classNames(styles.subHeader)}
          data-scroll
          data-scroll-speed="0.2"
        >
          Easily track and manage your spendings through a common space
        </h4>
      </section>
      <div className={classNames(styles.rightVisual)}></div>
    </div>
  );
}
