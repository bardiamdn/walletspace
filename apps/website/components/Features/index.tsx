'use client';
import React, { useEffect, useRef } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Form from './Form';
import Manage from './Manage';
import Scan from './Scan';
import Space from './Space';
import { AnimationContextProvider } from '../../context/AnimationContext';
import { useMediaQuery } from 'apps/website/context/MediaQueryContext';
import MotionPathPlugin from 'gsap/MotionPathPlugin';

export default function Index() {
  const { isMobile } = useMediaQuery();
  const titlesSectionRef = useRef(null);
  const descriptionsSectionRef = useRef(null);

  const featuresSectionRef = useRef(null);
  const animationWrapperRef = useRef(null);
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
    gsap.registerPlugin(MotionPathPlugin);
    // const textRefs = [
    //   ...titles.map((title) => title.ref.current),
    //   ...descriptions.map((desc) => desc.ref.current),
    // ];

    if (!isMobile) {
      titles.map((title, index) => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: title.ref.current,
            start: 'top 50%',
            end: index === titles.length - 1 ? '80% center' : 'bottom 50%',
            scrub: true,
            // markers: true,
          },
        });
        const leftCurvePath = document.getElementById(
          `left-curve-${index}`
        ) as SVGPathElement | null;

        timeline
          .to(title.ref.current, {
            motionPath: {
              path: leftCurvePath || '',
              align: leftCurvePath || '',
              alignOrigin: [0.5, 0.5],
              end: 0.5, // Stop at the middle of the path
            },
            opacity: 1,
            // duration: 0.3,
            ease: 'power1.inOut',
          })
          // Animate out of the middle
          .to(title.ref.current, {
            motionPath: {
              path: leftCurvePath || '',
              align: leftCurvePath || '',
              alignOrigin: [0.5, 0.5],
              start: 0.5, // Start from the middle of the path
              end: 1, // Finish the rest of the path
            },
            opacity: 0,
            delay: 0.3,
            // duration: 0.3,
            ease: 'power1.inOut',
          });
      });
      descriptions.map((description, index) => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: description.ref.current,
            start: 'top 50%',
            end:
              index === descriptions.length - 1 ? '80% center' : 'bottom 50%',
            scrub: true,
            // markers: true,
          },
        });
        const rightCurvePath = document.getElementById(
          `right-curve-${index}`
        ) as SVGPathElement | null;

        timeline
          .to(description.ref.current, {
            motionPath: {
              path: rightCurvePath || '',
              align: rightCurvePath || '',
              alignOrigin: [0.5, 0.5],
              end: 0.5, // Stop at the middle of the path
            },
            opacity: 1,
            // duration: 0.3,
            ease: 'power1.inOut',
          })
          // Animate out of the middle
          .to(description.ref.current, {
            motionPath: {
              path: rightCurvePath || '',
              align: rightCurvePath || '',
              alignOrigin: [0.5, 0.5],
              start: 0.5, // Start from the middle of the path
              end: 1, // Finish the rest of the path
            },
            opacity: 0,
            delay: 0.3,
            // duration: 0.3,
            ease: 'power1.inOut',
          });
      });
    }

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
          <div key={index} className="relative h-full ">
            {!isMobile && (
              <svg
                width="378"
                height="824"
                viewBox="0 0 378 824"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-0 right-0 2xl:-translate-x-3/4 xl:-translate-x-[60%] lg:-translate-x-[43%] -translate-x-[34%] w-auto h-full "
              >
                <path
                  id={`left-curve-${index}`}
                  d="M1 823C535.095 625.5 468.466 164 1 1"
                  stroke="none"
                />
              </svg>
            )}

            <div
              key={index}
              className={`${styles.titleContainer}`}
              ref={titleObj.ref}
              data-scroll
            >
              <h3>{titleObj.title}</h3>
            </div>
          </div>
        ))}
      </section>
      <section
        className={styles.animationWrapper}
        ref={animationWrapperRef}
        data-scroll-section
      >
        <div className="absolute inset-0 w-full md:h-[340vh] h-full ">
          <div
            className={styles.animationContainer}
            ref={animationContainerRef}
          >
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
            className="relative md:h-full md:w-full w-0 h-0 overflow-hidden "
          >
            <svg
              width="378"
              height="824"
              viewBox="0 0 378 824"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-0 left-0 2xl:translate-x-3/4 xl:translate-x-[60%] lg:translate-x-[43%] translate-x-[34%] h-full w-auto "
            >
              <path
                id={`right-curve-${index}`}
                d="M377 823C-157.095 625.5 -90.4656 164 377 1"
                stroke="none"
              />
            </svg>
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
          </div>
        ))}
      </section>
    </div>
  );
}
