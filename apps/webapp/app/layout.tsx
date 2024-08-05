'use client';
import React, { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaBookDead, FaBookOpen, FaCube, FaHome, FaPage4, FaPagelines, FaPlusCircle } from 'react-icons/fa';
import { AiFillProfile, AiOutlineDoubleLeft, AiOutlineProfile } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { IoHome, IoHomeOutline, IoCube, IoCubeOutline, IoFileTrayFull, IoFileTrayFullOutline, IoAddCircle } from "react-icons/io5";

import { useTheme, ThemeProvider } from '@/context/ThemeContext';
import Button from '@/components/Button'
import ToggleButton from '@/components/ToggleButton';
import ToggleGroup from '@/components/ToggleGroup';
import './global.css';

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
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter()

  const navigationItems = [
    { href: '/', icon: <IoHome size={24} className='mr-4' />, iconOutline: <IoHomeOutline size={24} className='mr-3' />, label: 'Home' },
    { href: '/space', icon: <IoCube size={24} className='mr-4' />, iconOutline: <IoCubeOutline size={24} className='mr-3' />, label: 'Space' },
    { href: '/records', icon: <IoFileTrayFull size={24} className='mr-4' />, iconOutline: <IoFileTrayFullOutline size={24} className='mr-3' />, label: 'Receipts' },
  ]

  const selectedIndex = navigationItems.findIndex(item => item.href === pathname);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div>
      <header>
        <h1 >WalletSpace</h1>
        <Button type='icon'>
          <VscAccount size={28} />
        </Button>
      </header>
      <div className="sidebar-navigation">
        <nav>
          <div className='flex flex-row justify-between'>
            <Button type='icon' >
              <AiOutlineDoubleLeft size={20} />
            </Button>
            <Button type='primary' className='flex flex-row justify-center items-center w-9/12'>
              <FaPlusCircle className='mr-4' size={18}/>
              Add Record
            </Button>
          </div>
          <hr />

          <ToggleGroup className="flex flex-col mb-6">
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
            <Button type='primary' onClick={toggleTheme} className='flex'>
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </Button>
          </div>
        </nav>
        <main>{children}</main>
      </div>
    </div>
  );
};

