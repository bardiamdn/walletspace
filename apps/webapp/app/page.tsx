'use client'
import React from 'react';
import Button from '@/components/Button';
import { FaHome } from 'react-icons/fa';
import ToggleGroup from '@/components/ToggleGroup';
import ToggleButton from '@/components/ToggleButton';
import Image from 'next/image';

export default function Index() {
  return (
    <div className="border w-6/12">
      <ToggleGroup  className='filter-home flex flex-row my-6'>
        <ToggleButton className='mr-2' type='filter'>
          this week
        </ToggleButton>
        <ToggleButton className='mr-2' type='filter'>
          this month
        </ToggleButton>
        <ToggleButton className='mr-2' type='filter'>
          last 3 months
        </ToggleButton>
        <ToggleButton className='mr-2' type='filter'>
          this year
        </ToggleButton>
        <ToggleButton className='mr-2' type='filter'>
          last 3 years
        </ToggleButton>
        <ToggleButton className='mr-2' type='filter'>
          max
        </ToggleButton>
      </ToggleGroup>
    </div>
  );
}
