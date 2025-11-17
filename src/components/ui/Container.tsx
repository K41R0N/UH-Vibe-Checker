import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-container',
  full: 'max-w-full',
};

export function Container({
  children,
  className = '',
  size = 'xl',
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component className={`container-custom ${sizeClasses[size]} ${className}`}>
      {children}
    </Component>
  );
}
