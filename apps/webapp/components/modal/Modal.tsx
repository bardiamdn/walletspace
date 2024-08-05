import React from 'react';
import classNames from 'classnames';

import styles from './Modal.module.css'; 
import ToggleGroup from '../ToggleGroup';
import ToggleButton from '../ToggleButton';
import Preferences from './pages/Prefrences';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={classNames(styles.overlay)} onClick={onClose}>
      <div className={classNames(styles.main, 'flex flex-row rounded-3xl border border-border')} onClick={(e) => e.stopPropagation()}>
        <ToggleGroup className={styles.list}>
          <ToggleButton type='modal' className='mb-2 px-2 py-1'>
            First
          </ToggleButton>
          <ToggleButton type='modal' className='mb-2 px-2 py-1'>
            Second
          </ToggleButton>
          <ToggleButton type='modal' className='mb-2 px-2 py-1'>
            Third
          </ToggleButton>
        </ToggleGroup>
        <div className={styles.vertical}/>
        <button className={classNames(styles.close)} onClick={onClose}>&times;</button>
        <Preferences />
      </div>
    </div>
  );
};

export default Modal;