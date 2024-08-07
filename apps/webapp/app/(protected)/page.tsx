'use client'
import React, { useState } from 'react';
import Button from '@/components/Button';
// import { FaHome } from 'react-icons/fa';
import ToggleGroup from '@/components/ToggleGroup';
import ToggleButton from '@/components/ToggleButton';
// import Image from 'next/image';
import styles from './page.module.css' 
import classNames from 'classnames';

export default function Index() {
  const [timeFrame, setTimeFrame] = useState<number>(1)

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
              // onClick={() => setTimeFrame(index)}
              >
              {item}
            </ToggleButton>
            ))
          }
        </ToggleGroup>
      </div>
      <div className='mt-12 mb-2'>
        <h2>Overview</h2>
      </div>
      <div className={styles.balanceContainer}>
        <div className={classNames('h-52 p-4 w-5/12 rounded-xl border border-border mr-4', styles.balanceCard)}>
          <h3>Total Balance</h3>
          <p className='text-text-secondary'>Your total balance</p>
        </div>
        <div className={classNames('h-52 p-4 w-7/12 rounded-xl border border-border', styles.balanceCard)}>
          <h3>Account Balances</h3>
        </div>
      </div>
      <div className='mt-12 mb-2'>
        <h2>Income and Expense</h2>
      </div>
      <div className={styles.balanceContainer}>
        <div className={classNames('h-52 p-4 w-6/12 rounded-xl border border-border mr-4', styles.balanceCard)}>
          <h3>Income from Categories</h3>
          <p className='text-text-secondary'>Your income {timeFrames[timeFrame]}</p>
        </div>
        <div className={classNames('h-52 p-4 w-6/12 rounded-xl border border-border', styles.balanceCard)}>
          <h3>Expense from Categories</h3>
          <p className='text-text-secondary'>Your expense {timeFrames[timeFrame]}</p>
        </div>
      </div>
      <div className={classNames(styles.balanceContainer, 'mt-4')}>
        <div className={classNames('h-52 p-4 w-full rounded-xl border border-border', styles.balanceCard)}>
          <h3>Income and Expense Compared</h3>
          <p className='text-text-secondary'>Your expense {timeFrames[timeFrame]}</p>
        </div>
      </div>
      <div className='mt-12 mb-2'>
        <h2>Cash Flow</h2>
      </div>
      <div className={styles.balanceContainer}>
        <div className={classNames('h-52 p-4 w-6/12 rounded-xl border border-border mr-4', styles.balanceCard)}>
          <h3>Income from Categories</h3>
          <p className='text-text-secondary'>Your income {timeFrames[timeFrame]}</p>
        </div>
        <div className={classNames('h-52 p-4 w-6/12 rounded-xl border border-border', styles.balanceCard)}>
          <h3>Expense from Categories</h3>
          <p className='text-text-secondary'>Your expense {timeFrames[timeFrame]}</p>
        </div>
      </div>
      {/* leave some empty space  */}
      <div className='h-80'></div>
    </div>
  );
}
