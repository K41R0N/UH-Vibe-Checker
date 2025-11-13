import React from 'react';
import { Container } from './Container';

interface HeroProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

const sizeClasses = {
  sm: 'min-h-[40vh] py-16 md:py-24',
  md: 'min-h-[60vh] py-20 md:py-32',
  lg: 'min-h-[80vh] py-24 md:py-40',
};

export function Hero({
  children,
  className = '',
  size = 'md',
  centered = true,
}: HeroProps) {
  return (
    <section
      className={`${sizeClasses[size]} flex items-center bg-cream-100 ${className}`}
    >
      <Container size="xl">
        <div className={centered ? 'text-center max-w-4xl mx-auto' : ''}>
          {children}
        </div>
      </Container>
    </section>
  );
}

interface HeroTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroTitle({ children, className = '' }: HeroTitleProps) {
  return (
    <h1 className={`text-display-lg md:text-display-xl font-display font-bold mb-6 text-balance ${className}`}>
      {children}
    </h1>
  );
}

interface HeroSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroSubtitle({ children, className = '' }: HeroSubtitleProps) {
  return (
    <p className={`text-body-lg md:text-body-xl text-black-600 mb-8 max-w-2xl ${className}`}>
      {children}
    </p>
  );
}

interface HeroActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroActions({ children, className = '' }: HeroActionsProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {children}
    </div>
  );
}
