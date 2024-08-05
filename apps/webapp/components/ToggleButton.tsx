import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';

type ToggleButtonProps = {
  children?: React.ReactNode;
  href: string,
  type: 'basic' | 'navigation'; 
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
}

const buttonStyles = {
  'basic': 'bg-transparent text-text-secondary hover:button-hover',
  'filter': 'focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 px-4 py-2 bg-blue-600 text-white rounded',
  'navigation': 'bg-transparent text-text-secondary font-medium rounded-lg py-2 px-2 hover:bg-button-hover hover:text-text-primary',
}

const toggledStyles = {
  'basic': 'bg-button-selected text-text-primary font-semibold',
  'filter': 'focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 px-4 py-2 bg-blue-600 text-white rounded',
  'navigation': 'bg-button-selected text-text-primary font-semibold rounded-lg py-2 px-2 hover:bg-button-hover',
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ children, href, type = 'basic', onClick, className, isActive }) => {
  return (
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
  );
}

export default ToggleButton;
