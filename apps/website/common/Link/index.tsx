import React, { useState } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

import styles from './styles.module.css';

type LinkPrep = {
  children: string;
  href: string;
  className?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel: string;
  ariaLabel?: string;
};

export default function Link({
  children,
  href,
  className,
  target,
  rel,
}: LinkPrep) {
  const [hover, setHover] = useState(false);

  return (
    <motion.a
      href={href}
      className={classNames(className, styles.link)}
      target={target}
      rel={rel}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
    >
      {hover ? (
        children.split('').map((char, index) =>
          char === ' ' ? (
            <span
              key={index}
              style={{ display: 'inline-block', width: '0.3em' }}
            >
              {char}
            </span>
          ) : (
            <motion.span
              key={index}
              style={{ display: 'inline-block' }}
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{
                times: [0, 0.5, 1],
                ease: 'easeInOut',
                delay: index * 0.025,
              }}
            >
              {char}
            </motion.span>
          )
        )
      ) : (
        <span>{children}</span>
      )}
    </motion.a>
  );
}
