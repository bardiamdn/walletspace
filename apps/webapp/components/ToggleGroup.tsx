import React, { useState, ReactNode, ReactElement } from 'react';
import ToggleButton from './ToggleButton';

type ToggleGroupProps = {
  children: ReactNode;
  className?: string;
  onChange?: (selectedIndex: number) => void;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({ children, className, onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
