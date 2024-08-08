'use client';
import React, { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaBookDead, FaBookOpen, FaCube, FaHome, FaPage4, FaPagelines, FaPlusCircle } from 'react-icons/fa';
import { AiFillProfile, AiOutlineDoubleLeft, AiOutlineDoubleRight, AiOutlineProfile } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { IoHome, IoHomeOutline, IoCube, IoCubeOutline, IoFileTrayFull, IoFileTrayFullOutline, IoAddCircle } from "react-icons/io5";

import { useTheme, ThemeProvider } from '@/context/ThemeContext';
import Button from '@/components/Button'
import ToggleButton from '@/components/ToggleButton';
import ToggleGroup from '@/components/ToggleGroup';
import Menu from '@/components/Menu/MenuModal';
import AddTransaction from '@/components/AddTransaction/AddModal';
import './global.css';
import classNames from 'classnames';

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {

  return (
    <html lang="en">
      <head>
        <title>Welcome</title>
        <meta name="description" content="from layout" />
      </head>
      <body>
        <ThemeProvider>
            <SidebarNavigation>{children}</SidebarNavigation>
        </ThemeProvider>
      </body>
    </html>
  );
}

const SidebarNavigation = ({ children }: RootLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const navigationItems = [
    { href: '/', icon: <IoHome size={24} className='mr-4' />, iconOutline: <IoHomeOutline size={24} className='mr-3' />, label: 'Home' },
    { href: '/space', icon: <IoCube size={24} className='mr-4' />, iconOutline: <IoCubeOutline size={24} className='mr-3' />, label: 'Space' },
    { href: '/history', icon: <IoFileTrayFull size={24} className='mr-4' />, iconOutline: <IoFileTrayFullOutline size={24} className='mr-3' />, label: 'History' },
  ]

  const selectedIndex = navigationItems.findIndex(item => item.href === pathname);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddOpen = () => {
    setIsAddOpen(true);
  };

  const handleAddClose = () => {
    setIsAddOpen(false);
  };

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className='w-full h-full flex flex-col'>
      <header>
        <h1 >WalletSpace</h1>
        <Button type='icon' onClick={handleMenuOpen}>
          <VscAccount size={28} />
        </Button>
      </header>
      <div className={classNames("sidebar-navigation", {'sidebar-closed': !isSidebarOpen})}>
        <nav className={classNames({'open': isSidebarOpen})}>
          <div className='flex flex-row justify-between'>
            <Button type='icon' onClick={toggleSidebar}>
              <AiOutlineDoubleLeft size={20}/>
            </Button>
            <Button type='primary' className='flex flex-row justify-center items-center w-9/12' onClick={handleAddOpen}>
              <FaPlusCircle className='mr-4' size={18}/>
              Add Transaction
            </Button>
          </div>
          <hr />

          <ToggleGroup className="flex flex-col mb-6" initialIndex={selectedIndex}>
            {navigationItems.map((item, index) => (
              <ToggleButton
                key={item.href}
                type='navigation'
                href={item.href}
                className="flex items-center mb-2"
                isActive={selectedIndex === index}
                onClick={() => router.push(item.href)}
              >
                {selectedIndex === index ? item.icon : item.iconOutline}
                {item.label}
              </ToggleButton>
            ))}
          </ToggleGroup>
          <div>
          </div>
        </nav>
        <div className={classNames('open-nav-buttons', { 'sidebar-closed': !isSidebarOpen })}>
          <Button className={"open-nav-button mr-4"} type='icon' onClick={toggleSidebar}>
            <AiOutlineDoubleRight size={20} />
          </Button>
          <Button className={"add-button h-8 w-8"} type='primary'>
            <FaPlusCircle size={30} onClick={handleAddOpen} />
          </Button>
        </div>
        <main className={classNames({ 'sidebar-closed': !isSidebarOpen })}>
          <div className={classNames('content')}>
            {children}
          </div>
        </main>
      </div>
      <Menu isOpen={isMenuOpen} onClose={handleMenuClose} />
      <AddTransaction isOpen={isAddOpen} onClose={handleAddClose} />
    </div>
  );
};

