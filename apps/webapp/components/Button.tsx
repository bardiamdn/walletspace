import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.css'
import Link from 'next/link';
import { Url } from 'next/dist/shared/lib/router/router';

type ButtonProps = {
  children?: React.ReactNode;
  type?: 'primary' | 'submit' | 'secondary' | 'destructive' | 'outline' | 'link' | 'icon';
  href?: Url,
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const buttonStyles = {
  'primary': 'relative bg-primary text-text-reverse rounded-2xl overflow-hidden hover:ring-4 hover:ring-accent hover:ring-opacity-50',
  'submit': 'bg-button-primary text-text-reverse rounded-lg py-1 px-4',
  'secondary': 'bg-button-secondary rounded-lg py-1 px-4',
  'outline': 'border border-border rounded-lg py-1 px-4 hover:bg-button-hover',
  'link': 'text-text-primary hover:text-text-secondary',
  'icon': 'bg-transparent text-text-secondary rounded-xl py-2 px-2 hover:bg-button-hover hover:text-text-primary',
  'destructive': 'border border-warning text-warning rounded-lg py-1 px-4 hover:bg-background-warning hover:text-text-primary',
}

const Button: React.FC<ButtonProps> = ({ children, type= 'submit', href, onClick, className}) => {

  if(type === 'link' && href) {
    return (
      <Link href={href} className={classNames(buttonStyles[type], className, 'flex flex-row items-center font-medium')} >
        {children}
      </Link>
    )
  }

  return (
    <button
    className={classNames(buttonStyles[type], className, 'flex flex-row items-center font-medium')}
    onClick={onClick}
    >
      {type === 'primary' && (
        <>
          <span className={styles.gradientOverlay}></span>
          <span className={classNames("relative flex flex-row items-center font-medium z-1")}>{children}</span>
        </>
      )}
      {type !== 'primary' && children}
    </button>
  );
}

export default Button;