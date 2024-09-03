'use client';

import { RefObject } from 'react';
import styles from './style.module.scss';

type FormProps = {
  formRef: RefObject<HTMLFormElement>;
  formInputRef: RefObject<HTMLInputElement>;
  earlyAccessRef: RefObject<HTMLButtonElement>;
};

export default function Form({
  formRef,
  formInputRef,
  earlyAccessRef,
}: FormProps) {
  return (
    <form ref={formRef} className={styles.form}>
      {/* <label
        htmlFor="email"
        // className="mb-4 text-lg font-semibold text-gray-800"
      >
        Sign up for early access?
      </label> */}
      {/* <div className={styles.ctaAction}> */}
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        className={styles.input}
        aria-label="Email"
        required
        ref={formInputRef}
      />
      <button type="submit" className={styles.button} ref={earlyAccessRef}>
        <p>Early Access</p>
      </button>
      {/* </div> */}
    </form>
  );
}
