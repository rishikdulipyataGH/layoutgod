import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'destructive' | 'outline' | 'secondary';
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  primary: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  outline: 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300',
  secondary: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  className = '', 
  variant = 'default', 
  ...props 
}) => {
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
