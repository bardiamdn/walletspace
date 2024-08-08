'use client'
import React, { useState } from 'react';
import ToggleGroup from '@/components/ToggleGroup';
import ToggleButton from '@/components/ToggleButton';
import styles from './page.module.css' 
import classNames from 'classnames';

export default function Space() {
  const [timeFrame, setTimeFrame] = useState<number>(1) // this month

  const timeFrames = ['this week', 'this month', 'last 3 months', 'last 6 months', 'this year', 'last 3 years', 'max']

  return (
    <div>
      <div className={styles.scrollContainer} >
        <ToggleGroup initialIndex={timeFrame} className='filter-home flex flex-row mt-6' onChange={index => setTimeFrame(index)}>
          {
            timeFrames.map((item, index) => (
              <ToggleButton 
              key={index} 
              className='mr-2' 
              type='filter'
              isActive={timeFrame === index}
              >
              {item}
            </ToggleButton>
            ))
          }
        </ToggleGroup>
      </div>
        <h2 className='mt-12 mb-2'>My Spaces</h2>
        <div className={classNames('h-60 p-4 w-full rounded-xl border border-border', styles.spaceCard)}>
          <h3>Home</h3>
          <p className='text-text-secondary'>A brief overview of the last activities at Home</p>
        </div>
        <div className={classNames('h-60 p-4 w-full rounded-xl border border-border', styles.spaceCard)}>
          <h3>Trip to Hawaii</h3>
          <p className='text-text-secondary'>A brief overview of the last activities at Trip to Hawaii</p>
        </div>
      {/* leave some empty space  */}
      <div className='h-80'></div>
    </div>
  );
}
