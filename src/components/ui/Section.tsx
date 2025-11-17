import React from 'react';
import { Container } from './Container';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'cream' | 'white' | 'black';
  id?: string;
}

const paddingClasses = {
  none: '',
  sm: 'section-padding-sm',
  md: 'section-padding',
  lg: 'section-padding-lg',
};

const backgroundClasses = {
  cream: 'bg-cream-100',
  white: 'bg-cream-50',
  black: 'bg-black text-cream-100',
};

export function Section({
  children,
  className = '',
  containerSize = 'xl',
  padding = 'md',
  background = 'cream',
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${paddingClasses[padding]} ${backgroundClasses[background]} ${className}`}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function SectionHeader({ children, className = '', centered = false }: SectionHeaderProps) {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function SectionTitle({ children, className = '', as: Component = 'h2' }: SectionTitleProps) {
  return (
    <Component className={`text-heading-xl font-display font-bold mb-4 ${className}`}>
      {children}
    </Component>
  );
}

interface SectionDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionDescription({ children, className = '' }: SectionDescriptionProps) {
  return <p className={`text-body-lg text-black-600 max-w-3xl ${className}`}>{children}</p>;
}
