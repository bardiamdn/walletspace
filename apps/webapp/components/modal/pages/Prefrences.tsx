import React from 'react';

import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/Button';

const Preferences = () => {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className='flex flex-col w-full items-center'>
      <div className='flex flex-row w-full justify-between items-center'>
        <label>Set theme</label>
        <Button type='outline' onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
      </div>
    </div>
  )
}

export default Preferences