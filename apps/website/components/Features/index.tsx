'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import classNames from 'classnames';

import Form from './animation/Form';
import Create from './animation/Create';

export default function Index() {
  const [isForm, setIsForm] = useState<boolean>(true);
  const titlesSectionRef = useRef(null);
  const descriptionsSectionRef = useRef(null);

  const featuresSectionRef = useRef(null);
  const animationRef = useRef(null);

  const firstTitleRef = useRef(null);
  const secondTitleRef = useRef(null);
  const thirdTitleRef = useRef(null);
  const forthTitleRef = useRef(null);

  const firstDescriptionRef = useRef(null);
  const secondDescriptionRef = useRef(null);
  const thirdDescriptionRef = useRef(null);
  const forthDescriptionRef = useRef(null);

  // form refs
  const formRef = useRef(null);
  const formInputRef = useRef(null);
  const earlyAccessRef = useRef(null);

  // create refs
  const createRef = useRef(null);

  const textRefs = [
    firstTitleRef,
    secondTitleRef,
    thirdTitleRef,
    forthTitleRef,
    firstDescriptionRef,
    secondDescriptionRef,
    thirdDescriptionRef,
    forthDescriptionRef,
  ];

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // titles and descriptions fade in and fade out
    textRefs.forEach((ref, index) => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 50%', // Start animation when the top of the element reaches 80% of the viewport
          end: 'bottom 50%', // End animation when the top of the element reaches 30% of the viewport
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
          opacity: 1, // Hold the opacity at 1 without any animation
          delay: 1.5,
        })
        .to(ref.current, {
          opacity: 0,
          duration: 1,
        });
    });

    // Space feature animation
    // gsap
    //   .timeline({
    //     scrollTrigger: {
    //       trigger: `.${styles.staySquare}`,
    //       start: '-100% 30%',
    //       end: '100% top',
    //       scrub: true,
    //       // markers: true,
    //     },
    //   })
    //   .to(`.${styles.firstMessage}`, {
    //     left: '0',
    //     opacity: 1,
    //     right: 'auto',
    //   })
    //   .to(`.${styles.firstMessage}`, {
    //     delay: 0.25,
    //     top: '70px',
    //     height: '45px',
    //     bottom: 'auto',
    //   })
    //   .to(`.${styles.secondMessage}`, {
    //     left: 'auto',
    //     right: '0',
    //     opacity: 1,
    //   })
    //   .to(`.${styles.secondMessage}`, {
    //     delay: 0.25,
    //     top: '125px',
    //     height: '45px',
    //     bottom: 'auto',
    //   });

    // handle animation container
    const mm = gsap.matchMedia();

    // Animations for desktop screens
    mm.add('(min-width: 769px)', () => {
      // animate the animation container
      ScrollTrigger.create({
        trigger: featuresSectionRef.current,
        start: '5% 70%',
        end: '95% 50%',
        onEnter: () => {
          setIsForm(false);

          const tl = gsap.timeline();
          tl.to(
            formRef,
            {
              opacity: 0,
              width: '100px',
              duration: 0.3,
              ease: 'power2.in',
            },
            '<'
            // '-=0.3' //start 0.3s before the previous animaiton ends
          )
            .to(
              formInputRef.current,
              {
                width: '100px',
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
              },
              '<'
              // '-=0.3' //start 0.3s before the previous animaiton ends
            )
            .to(
              earlyAccessRef.current,
              {
                width: '100px',
                right: '25%',
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
              },
              '<'
              // '-=0.3' //start 0.3s before the previous animaiton ends
            );

          tl.to(
            animationRef.current,
            {
              height: '60vh',
              padding: '20px',
              transform: 'translate(-50%, -50%)',
              duration: 0.5,
              delay: 0.5,
              ease: 'power2.inOut',
            },
            '-=0.3'
          );
        },
        onEnterBack: () => {
          setIsForm(false);
          gsap.to(animationRef.current, {
            height: '60vh',
            padding: '20px',
            transform: 'translate(-50%, -50%)',
            duration: 0.5,
            delay: 0.5,
            ease: 'power2.inOut',
          });
          gsap.to(formRef, {
            opacity: 0,
            // width: '100px',
            duration: 0.3,
            ease: 'power2.in',
          });
          gsap.to(formInputRef.current, {
            width: '100px',
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
          });
          gsap.to(earlyAccessRef.current, {
            width: '100px',
            right: '25%',
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
          });
        },
        onLeave: () => {
          setIsForm(true);
          gsap.to(animationRef.current, {
            height: '100px',
            padding: 0,
            transform: 'translate(-50%, 200px)',
            duration: 0.5,
            delay: 0.5,
            ease: 'power2.inOut',
          });
          gsap.to(formRef, {
            opacity: 1,
            // width: '100px',
            duration: 0.3,
            ease: 'power2.in',
          });
          gsap.to(formInputRef.current, {
            width: '400px',
            opacity: 1,
            duration: 0.3,
            ease: 'power2.in',
          });
          gsap.to(earlyAccessRef.current, {
            width: '150px',
            right: '0',
            opacity: 1,
            duration: 0.3,
            ease: 'power2.in',
          });
        },
        onLeaveBack: () => {
          setIsForm(true);
          gsap.to(animationRef.current, {
            height: '100px',
            padding: 0,
            transform: 'translate(-50%, -400px)',
            duration: 0.5,
            delay: 0.5,
            ease: 'power2.inOut',
          });
          gsap.to(formRef, {
            opacity: 1,
            // width: '100px',
            duration: 0.3,
            ease: 'power2.in',
          });
          gsap.to(formInputRef.current, {
            width: '400px',
            opacity: 1,
            duration: 0.3,
            ease: 'power2.in',
          });
          gsap.to(earlyAccessRef.current, {
            width: '150px',
            right: '0',
            opacity: 1,
            duration: 0.3,
            ease: 'power2.in',
          });
        },
      });
    });

    // Animations for mobile screens
    // mm.add('(max-width: 768px)', () => {
    //   gsap.to(animationRef.current, {
    //     scrollTrigger: {
    //       trigger: featuresSectionRef.current,
    //       start: '-50px 80%',
    //       end: '200px 80%',
    //       scrub: true,
    //       markers: false,
    //     },
    //     // opacity: 1,
    //     transform: 'translate(0, -50%)',
    //   });
    // });

    // return () => {
    //   ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    // };
  }, []);

  return (
    <div className={styles.mainContainer} ref={featuresSectionRef}>
      <section className={styles.titlesContainer} ref={titlesSectionRef}>
        <div className={styles.titleContainer} ref={firstTitleRef}>
          <h3>Create a space and add your friends</h3>
        </div>
        <div className={styles.titleContainer} ref={secondTitleRef}>
          <h3>Scan your receipts and assign extracted items to your friend</h3>
        </div>
        <div className={styles.titleContainer} ref={thirdTitleRef}>
          <h3>Manage and analyze your spendings together</h3>
        </div>
        <div className={styles.titleContainer} ref={forthTitleRef}>
          <h3>That&apos;s it</h3>
        </div>
      </section>
      <section className={styles.animationContainer} ref={animationRef}>
        <div
          className={classNames(
            styles.animation
            // isForm ? 'justify-center' : 'justify-start'
          )}
        >
          <Form
            formRef={formRef}
            formInputRef={formInputRef}
            earlyAccessRef={earlyAccessRef}
          />
          <Create createRef={createRef} />
          {/* <div className={styles.staySquare}>
            <div className="w-full flex flex-row justify-between items-center">
              <h4>🏡 Home</h4>
              <div className="flex flex-row ">
                <p className="text-lg">This month spending:</p>
                <p className="text-red-600 text-xl ml-2 font-bold">72</p>
              </div>
            </div>
            <hr className="opacity-0" />
            <div>
              <div className={styles.firstMessage}>
                Elif spent 21$ on groceries
              </div>
              <div className={styles.secondMessage}>
                Carlos spent 43$ on food
              </div>
            </div>
          </div> */}
        </div>
      </section>
      <section
        className={styles.descriptionsContainer}
        ref={descriptionsSectionRef}
      >
        <div className={styles.descriptionContainer} ref={firstDescriptionRef}>
          <ul>
            <li>Lorem ipsum odor amet, consectetuer adipiscing elit.</li>
            <li>
              Dolor aenean platea varius; praesent penatibus non fermentum
              facilisis.
            </li>
            <li>
              Interdum justo aptent ultricies vulputate accumsan nascetur ante
              iaculis.
            </li>
          </ul>
        </div>
        <div className={styles.descriptionContainer} ref={secondDescriptionRef}>
          <ul>
            <li>Lorem ipsum odor amet, consectetuer adipiscing elit.</li>
            <li>
              Dolor aenean platea varius; praesent penatibus non fermentum
              facilisis.
            </li>
          </ul>
        </div>
        <div className={styles.descriptionContainer} ref={thirdDescriptionRef}>
          <ul>
            <li>Lorem ipsum odor amet, consectetuer adipiscing elit.</li>
            <li>
              Dolor aenean platea varius; praesent penatibus non fermentum
              facilisis.
            </li>
            <li>
              Interdum justo aptent ultricies vulputate accumsan nascetur ante
              iaculis.
            </li>
          </ul>
        </div>
        <div className={styles.descriptionContainer} ref={forthDescriptionRef}>
          <ul>
            <li>Lorem ipsum odor amet, consectetuer adipiscing elit.</li>
            <li>
              Dolor aenean platea varius; praesent penatibus non fermentum
              facilisis.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
