import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';

type ToggleButtonProps = {
  children?: React.ReactNode;
  href?: string,
  type: 'basic' | 'navigation' | 'modal' | 'filter'; 
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
}

const buttonStyles = {
  'basic': 'bg-transparent text-text-secondary hover:button-hover',
  'modal': 'bg-transparent text-base text-text-secondary rounded-md py-1 px-2 hover:button-hover hover:bg-button-hover',
  'filter': 'px-3 py-1 bg-background-secondary text-text-secondary rounded-2xl border border-transparent hover:text-text-primary',
  'navigation': 'bg-transparent text-xl text-text-secondary font-medium rounded-lg py-2 px-2 hover:bg-button-hover hover:text-text-primary',
}

const toggledStyles = {
  'basic': 'bg-button-selected text-text-primary font-semibold',
  'modal': 'bg-button-selected text-base text-text-primary rounded-md py-1 px-2 hover:bg-button-hover',
  'filter': 'px-3 py-1 bg-background-secondary text-text-primary rounded-2xl border border-border font-medium',
  'navigation': 'bg-button-selected text-xl text-text-primary font-semibold rounded-lg py-2 px-2 hover:bg-button-hover hover:text-text-primary',
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ children, href, type = 'basic', onClick, className, isActive }) => {
  return (
    <>
      {
        type === 'navigation' && href?
        <Link
          href={href}
          className={classNames(
            !isActive && buttonStyles[type],
            isActive && toggledStyles[type],
            className,
            "flex flex-row items-center text-xl no-underline"
          )}
          onClick={onClick}
        >
          {children}
        </Link>
        :
        <button
          className={classNames(
            !isActive && buttonStyles[type],
            isActive && toggledStyles[type],
            className,
            "flex flex-row items-center"
          )}
          onClick={onClick}
        >
          {children}
        </button>

      }
    </>
  );
}

export default ToggleButton;
