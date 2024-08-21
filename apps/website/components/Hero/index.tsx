'use client';
import classNames from 'classnames';
import gsap from 'gsap';
import styles from './style.module.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';

export default function Index() {
  const pageRef = useRef(null);
  const titleOneRef = useRef(null);
  const titleTwoRef = useRef(null);
  const subTitleOneRef = useRef(null);
  const subTitleTwoRef = useRef(null);
  const formRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: pageRef.current,
        start: '300px 250px',
        end: '300px top',
        scrub: true,
        markers: true,
      },
    });

    timeline
      .to(titleOneRef.current, {
        y: '-200px',
      })
      .to(
        titleTwoRef.current,
        {
          y: '-150px',
        },
        '<'
      )
      .to(
        subTitleOneRef.current,
        {
          y: '-120px',
        },
        '<'
      )
      .to(
        subTitleTwoRef.current,
        {
          y: '-100px',
        },
        '<'
      )
      .to(
        formRef.current,
        {
          y: '-75px',
        },
        '<'
      );
  });

  return (
    <div className={styles.heroContainer}>
      <div className="mt-64">Something here</div>
      <section className={styles.ctaContainer}>
        <h1 ref={titleOneRef} className={styles.header}>
          Manage your
        </h1>
        <br />
        <h1 ref={titleTwoRef} className={classNames(styles.header, 'mb-12')}>
          shared expenses
        </h1>
        <h4 ref={subTitleOneRef} className={styles.subHeader}>
          Easiest and fastest way to split
        </h4>
        <br />
        <h4
          ref={subTitleTwoRef}
          className={classNames(styles.subHeader, 'mb-12')}
        >
          and manage your shared expenses.
        </h4>
        <form ref={formRef} className={styles.form}>
          <label
            htmlFor="email"
            className="mb-4 text-lg font-semibold text-gray-800"
          >
            Wanna try the beta version?
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
      <div className="mt-64">And something here</div>
    </div>
  );
}
