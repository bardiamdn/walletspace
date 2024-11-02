'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Form from './Form';
import Manage from './Manage';
import Scan from './Scan';
import Space from './Space';
import { AnimationContextProvider } from '../../context/AnimationContext';

export default function Index() {
  const titlesSectionRef = useRef(null);
  const descriptionsSectionRef = useRef(null);

  const featuresSectionRef = useRef(null);
  const animationPlaceholderRef = useRef(null);
  const animationContainerRef = useRef(null);

  const firstTitleRef = useRef(null);
  const secondTitleRef = useRef(null);
  const thirdTitleRef = useRef(null);

  const firstDescriptionRef = useRef(null);
  const secondDescriptionRef = useRef(null);
  const thirdDescriptionRef = useRef(null);

  const titles = [
    {
      title: 'Effortlessly Scan and Extract Receipt Data',
      ref: firstTitleRef,
    },
    {
      title: 'Organize Items and Share with Ease',
      ref: secondTitleRef,
    },
    {
      title: 'Manage and Track Shared Spaces',
      ref: thirdTitleRef,
    },
  ];

  const descriptions = [
    {
      descriptionArray: [
        'Quickly scan your receipts to extract item details.',
        'Automatically categorize items for easy tracking.',
        'Gain insights into your spending habits.',
      ],
      ref: firstDescriptionRef,
    },
    {
      descriptionArray: [
        'Assign items to your shared space effortlessly.',
        'Easily share and split costs with friends.',
      ],
      ref: secondDescriptionRef,
    },
    {
      descriptionArray: [
        'Monitor shared expenses with your friends.',
        'Keep track of group spending and individual contributions.',
        'Or use it for personal finance management.',
      ],
      ref: thirdDescriptionRef,
    },
  ];

  useEffect(() => {
    const textRefs = [
      firstTitleRef,
      secondTitleRef,
      thirdTitleRef,
      firstDescriptionRef,
      secondDescriptionRef,
      thirdDescriptionRef,
    ];

    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      textRefs.forEach((ref, index) => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 50%',
            end: 'bottom 50%',
            scrub: true,
          },
        });

        timeline
          .fromTo(
            ref.current,
            {
              opacity: 0,
            },
            {
              opacity: 1,
              duration: 1,
            }
          )
          .set(ref.current, {
            opacity: 1,
            delay: 1.5,
          })
          .to(ref.current, {
            opacity: 0,
            duration: 0.5,
          });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className={styles.mainContainer} ref={featuresSectionRef}>
      <section
        className={styles.titlesContainer}
        ref={titlesSectionRef}
        data-scroll-section
      >
        {titles.map((titleObj, index) => (
          <div
            key={index}
            className={styles.titleContainer}
            ref={titleObj.ref}
            data-scroll
          >
            <h3>{titleObj.title}</h3>
          </div>
        ))}
      </section>
      <section
        className={styles.animationPlaceholder}
        ref={animationPlaceholderRef}
        data-scroll-section
      >
        <div className={styles.animationContainer} ref={animationContainerRef}>
          <AnimationContextProvider>
            <Form
              desktopSectionRef={titlesSectionRef} // titlesSectionRef for better alignment with other animations
              mobileSectionRef={featuresSectionRef}
              // placeholderRef={animationPlaceholderRef}
              containerRef={animationContainerRef}
              titlesSectionRef={titlesSectionRef}
              descriptionsSectionRef={descriptionsSectionRef}
            />
            <Scan triggerRef={firstTitleRef} />
            <Space triggerRef={secondTitleRef} />
            <Manage triggerRef={thirdTitleRef} />
          </AnimationContextProvider>
        </div>
      </section>
      <section
        className={styles.descriptionsContainer}
        ref={descriptionsSectionRef}
        data-scroll-section
      >
        {descriptions.map((descriptionObj, index) => (
          <div
            key={index}
            className={styles.descriptionContainer}
            ref={descriptionObj.ref}
            data-scroll
          >
            <ul>
              {descriptionObj.descriptionArray.map(
                (description, descriptionIndex) => (
                  <li key={descriptionIndex}>{description}</li>
                )
              )}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
