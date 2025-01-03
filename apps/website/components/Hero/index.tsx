'use client';
import classNames from 'classnames';
import gsap from 'gsap';
import styles from './style.module.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

export default function Index() {
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subTitleRef = useRef(null);

  // const title = 'Manage Your Shared Finance';
  // const subtitle =
  //   'Easily track and manage your spending through a common space';
  const title = 'Shared Spending, Simplified';
  const subtitle =
    'Track and manage shared expenses effortlessly—no need for a joint account';

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // title and subtitle loading animation
    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      gsap.to(mainRef.current, {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 30,
        paddingTop: 60,
        duration: 1,
        ease: 'power2.out',
      });
    }).add('(max-width: 768px)', () => {
      gsap.to(mainRef.current, {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingTop: 50,
        duration: 1,
        ease: 'power2.out',
      });
    });

    gsap.fromTo(
      titleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: 'power2.inOut' }
    );
    gsap.fromTo(
      subTitleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: 'power2.inOut' }
    );

    return () => {
      // Cleanup ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className={styles.main} ref={mainRef}>
      <div className={styles.heroContainer} ref={heroRef} data-scroll-section>
        <section className={styles.ctaContainer}>
          <div className={styles.titles}></div>
          <h1
            ref={titleRef}
            className={classNames(styles.title)}
            data-scroll
            data-scroll-speed="0.2"
          >
            {title}
          </h1>
          <div className={styles.subtitles}></div>
          <h4
            ref={subTitleRef}
            className={classNames(styles.subtitle)}
            data-scroll
            data-scroll-speed="0.2"
          >
            {subtitle}
          </h4>
        </section>
      </div>
    </main>
  );
}
