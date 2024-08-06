import React, { useState } from 'react';
import { 
  IoPersonCircleOutline, 
  IoPersonCircle, 
  IoCardOutline, 
  IoCard, 
  IoPricetagOutline, 
  IoPricetag, 
  IoNotificationsOutline, 
  IoNotifications,
  IoSettingsOutline,
  IoSettings,
} from 'react-icons/io5';

import styles from './MenuModal.module.css'; 
import ToggleGroup from '../ToggleGroup';
import ToggleButton from '../ToggleButton';
import Account from './pages/Account';
import BankAccounts from './pages/BankAccounts';
import Categories from './pages/Categories';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Modal from '../Modal';

const menuItems = [
  { label: 'Account', iconOutline: IoPersonCircleOutline, icon: IoPersonCircle, component: <Account /> },
  { label: 'Bank Accounts', iconOutline: IoCardOutline, icon: IoCard, component: <BankAccounts /> },
  { label: 'Categories', iconOutline: IoPricetagOutline, icon: IoPricetag, component: <Categories /> },
  { label: 'Notifications', iconOutline: IoNotificationsOutline, icon: IoNotifications, component: <Notifications /> },
  { label: 'Settings', iconOutline: IoSettingsOutline, icon: IoSettings, component: <Settings /> }
];

type MenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='flex flex-row rounded-3xl border border-border'>
      <ToggleGroup className={styles.list} initialIndex={selectedIndex} onChange={setSelectedIndex}>
        {menuItems.map((item, index) => (
          <ToggleButton key={index} type='modal' className='mb-2 px-2 py-1'>
            <item.iconOutline size={18} className='mr-2' />
            {/* { selectedIndex === index? <item.icon size={18} className='mr-2' /> : <item.iconOutline size={18} className='mr-2' /> } */}
            {item.label}
          </ToggleButton>
        ))}
      </ToggleGroup>
      <div className={styles.vertical} />
      {menuItems[selectedIndex].component}
    </Modal>
  );
};

export default Menu;
