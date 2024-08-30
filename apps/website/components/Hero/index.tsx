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
  const formRef = useRef(null);

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

    // gsap
    //   .timeline({
    //     scrollTrigger: {
    //       trigger: heroRef.current,
    //       start: '300px 250px',
    //       end: '500px top',
    //       scrub: true,
    //       markers: true,
    //     },
    //   })
    //   .to(titleRef.current, {
    //     y: '100px',
    //   })
    //   .to(
    //     subTitleRef.current,
    //     {
    //       y: '100px',
    //     },
    //     '<'
    //   )
    //   .to(
    //     formRef.current,
    //     {
    //       y: '100px',
    //     },
    //     '<'
    //   );

    // individual loading animation
    gsap.fromTo(
      titleRef.current,
      { x: -5, y: 20, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 1, ease: 'power2.inOut' }
    );
    gsap.fromTo(
      subTitleRef.current,
      { x: -2, y: 15, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 1, ease: 'power2.inOut' }
    );

    return () => {
      // Cleanup ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  });

  return (
    <div className={styles.heroContainer} ref={heroRef}>
      <div className={classNames(styles.leftVisual)}></div>
      <section className={styles.ctaContainer}>
        <h1 ref={titleRef} className={classNames(styles.header)}>
          Manage Your Shared Finance
        </h1>
        <h4 ref={subTitleRef} className={classNames(styles.subHeader)}>
          Easily track and manage your spendings through a common space
        </h4>
        <form ref={formRef} className={styles.form}>
          <label
            htmlFor="email"
            className="mb-4 text-lg font-semibold text-gray-800"
          >
            Want early access?
          </label>
          <div className={styles.ctaAction}>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={styles.input}
              aria-label="Email"
              required
            />
            <button type="submit" className={styles.button}>
              <p className="font-semibold">Submit</p>
            </button>
          </div>
        </form>
      </section>
      <div className={classNames(styles.rightVisual)}></div>
    </div>
  );
}
