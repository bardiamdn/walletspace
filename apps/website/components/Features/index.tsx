'use client';
import React, { useEffect, useRef } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Form from './animation/Form';
import Create from './animation/Create';
import Scan from './animation/Scan';
import Space from './animation/Space';

export default function Index() {
  const titlesSectionRef = useRef(null);
  const descriptionsSectionRef = useRef(null);

  const featuresSectionRef = useRef(null);
  const animationPlaceholderRef = useRef(null);
  const animationContainerRef = useRef(null);

  const firstTitleRef = useRef(null);
  const secondTitleRef = useRef(null);
  const thirdTitleRef = useRef(null);
  const fourthTitleRef = useRef(null);

  const firstDescriptionRef = useRef(null);
  const secondDescriptionRef = useRef(null);
  const thirdDescriptionRef = useRef(null);
  const fourthDescriptionRef = useRef(null);

  const titles = [
    {
      title: 'Extract all data by just scanning your receipts',
      ref: firstTitleRef,
    },
    {
      title: 'Select the items and assign it to your space',
      ref: secondTitleRef,
    },
    {
      title: 'Share or split items',
      ref: thirdTitleRef,
    },
  ];

  const descriptions = [
    {
      descriptionArray: [
        'Let AI instantly extract items.',
        'And other related data so you can easily manage all your data.',
      ],
      ref: firstDescriptionRef,
    },
    {
      descriptionArray: [
        'Share and split the items with your friends.',
        'Track your shared spendings.',
      ],
      ref: secondDescriptionRef,
    },
    {
      descriptionArray: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
        'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      ],
      ref: thirdDescriptionRef,
    },
  ];

  useEffect(() => {
    const textRefs = [
      firstTitleRef,
      secondTitleRef,
      thirdTitleRef,
      fourthTitleRef,
      firstDescriptionRef,
      secondDescriptionRef,
      thirdDescriptionRef,
      fourthDescriptionRef,
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
          <Form
            desktopSectionRef={titlesSectionRef} // titlesSectionRef for better alignment with other animations
            mobileSectionRef={featuresSectionRef}
            placeholderRef={animationPlaceholderRef}
            containerRef={animationContainerRef}
            titlesSectionRef={titlesSectionRef}
            descriptionsSectionRef={descriptionsSectionRef}
          />
          <Create triggerRef={firstTitleRef} />
          <Scan triggerRef={secondTitleRef} />
          <Space triggerRef={thirdTitleRef} />
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
