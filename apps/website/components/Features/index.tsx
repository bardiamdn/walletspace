'use client';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import classNames from 'classnames';

import Form from './animation/Form';
import Create from './animation/Create';
import Scan from './animation/Scan';
import Space from './animation/Space';

export default function Index() {
  const [formOpen, setFormOpen] = useState<boolean>(true);
  const [animationEnd, setAnimationEnd] = useState<boolean>(false);
  const titlesSectionRef = useRef(null);
  const descriptionsSectionRef = useRef(null);

  const featuresSectionRef = useRef(null);
  const animationRef = useRef(null);

  const firstTitleRef = useRef(null);
  const secondTitleRef = useRef(null);
  const thirdTitleRef = useRef(null);
  const fourthTitleRef = useRef(null);

  const firstDescriptionRef = useRef(null);
  const secondDescriptionRef = useRef(null);
  const thirdDescriptionRef = useRef(null);
  const fourthDescriptionRef = useRef(null);

  // form refs
  const formRef = useRef(null);
  const formInputRef = useRef(null);
  const earlyAccessRef = useRef(null);

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

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    // desktop animation
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

      // form animation
      ScrollTrigger.create({
        trigger: titlesSectionRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setFormOpen(false);
          const tl = gsap.timeline();
          tl
            // .to(
            //   formInputRef.current,
            //   {
            //     width: '100px',
            //     opacity: 0,
            //     duration: 0.3,
            //     ease: 'power2.in',
            //   },
            //   '<'
            //start 0.3s before the previous animaiton ends
            // )
            //   .to(
            //     earlyAccessRef.current,
            //     {
            //       width: '100px',
            //       right: '25%',
            //       opacity: 0,
            //       duration: 0.3,
            //       ease: 'power2.in',
            //     },
            //     '<'
            //start 0.3s before the previous animaiton ends
            //   )
            .to(
              formRef.current,
              {
                opacity: 0,
                width: 0,
                height: 0,
                duration: 0.3,
                ease: 'power2.in',
              },
              '<' //start 0.3s before the previous animaiton ends
            );

          tl.to(
            animationRef.current,
            {
              height: '60vh',
              transform: 'translateY(-50%)',
              duration: 0.5,
              delay: 0.5,
              ease: 'power2.inOut',
            },
            '-=0.3'
          );
        },
        onEnterBack: () => {
          setFormOpen(false);
          gsap.to(animationRef.current, {
            height: '60vh',
            transform: 'translateY(-50%)',
            duration: 0.5,
            delay: 0.5,
            ease: 'power2.inOut',
          });
          // gsap.to(formInputRef.current, {
          //   width: '100px',
          //   opacity: 0,
          //   duration: 0.3,
          //   ease: 'power2.in',
          // });
          // gsap.to(earlyAccessRef.current, {
          //   width: '100px',
          //   right: '25%',
          //   opacity: 0,
          //   duration: 0.3,
          //   ease: 'power2.in',
          // });
          gsap.to(formRef.current, {
            opacity: 0,
            width: 0,
            height: 0,
            duration: 0.3,
            ease: 'power2.in',
          });
        },
        onLeave: () => {
          setFormOpen(true);
          gsap.to(animationRef.current, {
            height: '100px',
            transform: 'translateY(0)',
            duration: 0.5,
            delay: 0.5,
            ease: 'power2.inOut',
          });
          // gsap.to(formInputRef.current, {
          //   width: '400px',
          //   opacity: 1,
          //   duration: 0.3,
          //   ease: 'power2.in',
          // });
          // gsap.to(earlyAccessRef.current, {
          //   width: '150px',
          //   right: '0',
          //   opacity: 1,
          //   duration: 0.3,
          //   ease: 'power2.in',
          // });
          gsap.to(formRef.current, {
            opacity: 1,
            width: '400px',
            height: '100%',
            duration: 0.3,
            ease: 'power2.in',
          });
        },
        onLeaveBack: () => {
          setFormOpen(true);
          gsap.to(animationRef.current, {
            height: '100px',
            transform: 'translateY(-35vh)',
            duration: 0.5,
            delay: 0.5,
            ease: 'power2.inOut',
          });
          // gsap.to(formInputRef.current, {
          //   width: '400px',
          //   opacity: 1,
          //   duration: 0.3,
          //   ease: 'power2.in',
          // });
          // gsap.to(earlyAccessRef.current, {
          //   width: '150px',
          //   right: '0',
          //   opacity: 1,
          //   duration: 0.3,
          //   ease: 'power2.in',
          // });
          gsap.to(formRef.current, {
            opacity: 1,
            width: '400px',
            height: '100%',
            duration: 0.3,
            ease: 'power2.in',
          });
        },
      });
    });

    // Animations for mobile screens
    mm.add('(max-width: 768px)', () => {
      ScrollTrigger.create({
        trigger: featuresSectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        pin: true,
        onEnter: () => {
          setFormOpen(false);
          const tl = gsap.timeline();
          // tl.to(
          //   formRef.current,
          //   {
          //     opacity: 0,
          //     width: 0,
          //     height: 0,
          //     duration: 0.3,
          //     ease: 'power2.in',
          //   },
          //   '<'
          //start 0.3s before the previous animaiton ends
          // );

          tl.to(animationRef.current, {
            height: '100%',
            transform: 'translateY(0)',
            duration: 0.5,
            delay: 0.5,
            ease: 'power2.inOut',
          });
        },
        onEnterBack: () => {
          setFormOpen(false);
          gsap.to(animationRef.current, {
            height: '100%',
            transform: 'translateY(0)',
            duration: 0.5,
            delay: 0.5,
            ease: 'power2.inOut',
          });
        },
        onLeave: () => {
          setFormOpen(true);
          gsap.to(animationRef.current, {
            height: '100px',
            transform: 'translateY(45vh)',
            duration: 0.5,
            delay: 0.5,
            ease: 'power2.inOut',
          });
        },
        onLeaveBack: () => {
          setFormOpen(true);
          gsap.to(animationRef.current, {
            height: '100px',
            transform: 'translateY(-60vh)',
            duration: 0.5,
            delay: 0.5,
            ease: 'power2.inOut',
          });
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
        className={classNames(
          styles.animationPlaceholder
          // animationEnd ? 'translate-x-2/4 translate-y-2/4' : ''
        )}
        data-scroll-section
      >
        <div className={styles.animationContainer} ref={animationRef}>
          <div
            className={classNames(
              styles.animation
              // formOpen ? 'justify-center' : 'justify-start'
            )}
          >
            {formOpen && (
              <Form
                formRef={formRef}
                formInputRef={formInputRef}
                earlyAccessRef={earlyAccessRef}
              />
            )}
            <Create triggerRef={firstTitleRef} />
            <Scan triggerRef={secondTitleRef} />
            <Space triggerRef={thirdTitleRef} />
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
