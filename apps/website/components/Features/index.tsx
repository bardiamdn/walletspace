'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import styles from './style.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Index() {
  const titlesSectionRef = useRef(null);
  const descriptionsSectionRef = useRef(null);

  const featuresSectionRef = useRef(null);
  const animationRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // media scroll
    // gsap
    //   .timeline({
    //     scrollTrigger: featuresSectionRef.current,
    //     start: 'top top',
    //     end: 'bottom bottom',
    //     scrub: true,
    //     markers: true,
    //   })
    //   .to(
    //     titlesSectionRef.current,
    //     {
    //       yPercent: '-100',
    //       duration: 2,
    //       ease: 'power1.inOut',
    //     },
    //     0
    //   )
    //   .to(
    //     descriptionsSectionRef.current,
    //     {
    //       yPercent: '-100',
    //       duration: 2,
    //       ease: 'power1.inOut',
    //     },
    //     0
    //   );

    // Space feature animation
    gsap
      .timeline({
        scrollTrigger: {
          trigger: `.${styles.staySquare}`,
          start: '-100% 30%',
          end: '100% top',
          scrub: true,
          markers: false,
        },
      })
      .to(`.${styles.firstMessage}`, {
        left: '0',
        opacity: 1,
        right: 'auto',
      })
      .to(`.${styles.firstMessage}`, {
        delay: 0.25,
        top: '70px',
        height: '45px',
        bottom: 'auto',
      })
      .to(`.${styles.secondMessage}`, {
        left: 'auto',
        right: '0',
        opacity: 1,
      })
      .to(`.${styles.secondMessage}`, {
        delay: 0.25,
        top: '125px',
        height: '45px',
        bottom: 'auto',
      });

    // Apply features section's initial animation
    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      // Animations for desktop screens
      gsap.to(animationRef.current, {
        scrollTrigger: {
          trigger: featuresSectionRef.current,
          start: '-100px 80%',
          end: '400px 80%',
          scrub: true,
          markers: false,
          onUpdate: (self) => {
            const progress = self.progress;
            const height = gsap.utils.mapRange(0, 1, 100, 400)(progress);
          },
        },
        opacity: 1,
        transform: 'translate(-50%, -50%)',
      });
    });

    mm.add('(max-width: 768px)', () => {
      // Animations for mobile screens
      gsap.to(animationRef.current, {
        scrollTrigger: {
          trigger: featuresSectionRef.current,
          start: '-50px 80%',
          end: '200px 80%',
          scrub: true,
          markers: false,
        },
        opacity: 1,
        transform: 'translate(0, -50%)',
      });
    });

    return () => {
      // Cleanup ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className={styles.mainContainer} ref={featuresSectionRef}>
      <section className={styles.titlesContainer} ref={titlesSectionRef}>
        <div className={styles.titleContainer}>
          <h3>Create a space and add your friends</h3>
        </div>
        <div className={styles.titleContainer}>
          <h3>Scan your receipts and assign extracted items to your friend</h3>
        </div>
        <div className={styles.titleContainer}>
          <h3>Manage and analyze your spendings together</h3>
        </div>
        <div className={styles.titleContainer}>
          <h3>That&apos;s it</h3>
        </div>
      </section>
      <section className={styles.animationContainer} ref={animationRef}>
        <div className={styles.animation}>
          <div className={styles.staySquare}>
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
          </div>
        </div>
      </section>
      <section
        className={styles.descriptionsContainer}
        ref={descriptionsSectionRef}
      >
        <div className={styles.descriptionContainer}>
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
        <div className={styles.descriptionContainer}>
          <ul>
            <li>Lorem ipsum odor amet, consectetuer adipiscing elit.</li>
            <li>
              Dolor aenean platea varius; praesent penatibus non fermentum
              facilisis.
            </li>
          </ul>
        </div>
        <div className={styles.descriptionContainer}>
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
        <div className={styles.descriptionContainer}>
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
