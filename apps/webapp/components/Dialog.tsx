import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './Dialog.module.css'; 

type DialogProps = {
  children: ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};
type DialogSubComponentProps = {
  children: ReactNode;
  className?: string;
};


const Dialog: React.FC<DialogProps> = ({ children, className, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className={classNames(styles.overlay)} onClick={onClose}>
      <div className={classNames(styles.dialog, 'rounded-lg bg-background-secondary', className)} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
};
export const DialogHeader: React.FC<DialogSubComponentProps> = ({ children, className }) => {
  return (
    <div className={classNames(styles.header, className)} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  )
};
export const DialogContent: React.FC<DialogSubComponentProps> = ({ children, className }) => {
  return (
    <div className={classNames(styles.content, className)} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  )
};
export const DialogFooter: React.FC<DialogSubComponentProps> = ({ children, className }) => {
  return (
    <div className={classNames(styles.footer, className)} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  )
};

export default Dialog;