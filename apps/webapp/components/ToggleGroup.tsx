import React, { useState, useEffect, ReactNode, ReactElement } from 'react';
import ToggleButton from './ToggleButton';

type ToggleGroupProps = {
  children: ReactNode;
  initialIndex?: number;
  className?: string;
  onChange?: (selectedIndex: number) => void;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({ children, initialIndex, className, onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(initialIndex? initialIndex : null);

  useEffect(() => {
    if (typeof initialIndex === 'number') {
      setSelectedIndex(initialIndex);
    }
  }, [initialIndex]);

  const handleToggle = (index: number) => {
    setSelectedIndex(index);
    if (onChange) {
      onChange(index);
    }
  };

  
  const modifiedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child) && child.type === ToggleButton) {
      return React.cloneElement(child as ReactElement<any>, {
        isActive: index === selectedIndex,
        onClick: () => handleToggle(index),
      });
    }
    return child;
  });

  return <div className={className}>{modifiedChildren}</div>;
};

export default ToggleGroup;
