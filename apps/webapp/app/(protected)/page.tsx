'use client'
import React, { useState } from 'react';
import Button from '@/components/Button';
// import { FaHome } from 'react-icons/fa';
import ToggleGroup from '@/components/ToggleGroup';
import ToggleButton from '@/components/ToggleButton';
// import Image from 'next/image';
import styles from './page.module.css' 

export default function Index() {
  const [timeFrame, setTimeFrame] = useState<number>(1)

  const timeFrames = ['this week', 'this month', 'last 3 months', 'last 6 months', 'this year', 'last 3 years', 'max', 'last 3 months', 'last 6 months', 'this year', 'last 3 years', 'max']

  return (
    <div className="border">
      <div className={styles.scrollContainer} >
        <ToggleGroup initialIndex={timeFrame} className='filter-home flex flex-row my-6'>
          {
            timeFrames.map((item, index) => (
              <ToggleButton 
              key={index} 
              className='mr-2' 
              type='filter'
              isActive={timeFrame === index}
              onClick={() => setTimeFrame(index)}
              >
              {item}
            </ToggleButton>
            ))
          }
        </ToggleGroup>
      </div>
    </div>
  );
}
