import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './Modal.module.css'; 

type ModalProps = {
  children: ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, className, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={classNames(styles.overlay)} onClick={onClose}>
      <div className={classNames(styles.main, className)} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;