import React from 'react';

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Separator: React.FC<SeparatorProps> = ({ 
  className = '', 
  orientation = 'horizontal', 
  ...props 
}) => {
  const orientationClasses = orientation === 'horizontal'
    ? 'w-full h-px'
    : 'w-px h-full';

  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 ${orientationClasses} ${className}`}
      {...props}
    />
  );
};
