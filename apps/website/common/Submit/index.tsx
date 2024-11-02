import React, { RefObject, useState, useEffect } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';

type SubmitProps = {
  children: React.ReactNode;
  className?: string;
  ref?: RefObject<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  successMessage?: string;
};

export default function Submit({
  children,
  className,
  disabled,
  ref,
  loading = false,
  error,
}: SubmitProps) {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(error);
  useEffect(() => {
    setErrorMessage(error);
    if (error) {
      const timer = setTimeout(() => {
        setErrorMessage(undefined);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <button
      type="submit"
      ref={ref}
      disabled={disabled}
      className={classNames(styles.submitButton, className)}
    >
      {loading ? (
        <div className={styles.loading}></div>
      ) : errorMessage ? (
        <span className={styles.error}>{errorMessage}</span>
      ) : (
        <span className={styles.text}>{children}</span>
      )}
    </button>
  );
}
