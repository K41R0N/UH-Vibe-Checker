import React from 'react';

interface DataGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

const columnClasses = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

export function DataGrid({ children, className = '', columns = 2 }: DataGridProps) {
  return (
    <div className={`grid ${columnClasses[columns]} gap-6 md:gap-8 ${className}`}>
      {children}
    </div>
  );
}

interface DataItemProps {
  label: string;
  value: string | number | React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  layout?: 'vertical' | 'horizontal';
}

export function DataItem({ label, value, icon, className = '', layout = 'vertical' }: DataItemProps) {
  if (layout === 'horizontal') {
    return (
      <div className={`flex items-center justify-between py-4 border-b border-black-100 ${className}`}>
        <div className="flex items-center gap-3">
          {icon && <div className="text-black-600">{icon}</div>}
          <span className="text-body-md text-black-600">{label}</span>
        </div>
        <span className="text-body-lg font-medium text-black">{value}</span>
      </div>
    );
  }

  return (
    <div className={`bg-cream-50 border border-black-100 p-6 transition-all duration-300 hover:border-black-300 ${className}`}>
      <div className="flex items-start gap-3 mb-2">
        {icon && <div className="text-black-600 mt-1">{icon}</div>}
        <span className="text-body-sm text-black-500 font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-heading-md font-display font-bold text-black">{value}</div>
    </div>
  );
}

interface StatsGridProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  className?: string;
}

export function StatsGrid({ stats, className = '' }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-cream-50 border border-black-100 p-6 transition-all duration-300 hover:border-black-300"
        >
          <div className="text-body-xs text-black-500 uppercase tracking-wide mb-2">
            {stat.label}
          </div>
          <div className="text-display-sm font-display font-bold mb-2">{stat.value}</div>
          {stat.change && (
            <div
              className={`text-body-sm font-medium ${
                stat.trend === 'up'
                  ? 'text-green-600'
                  : stat.trend === 'down'
                  ? 'text-red-600'
                  : 'text-black-500'
              }`}
            >
              {stat.change}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}

export function Badge({ children, className = '', variant = 'default' }: BadgeProps) {
  const variantClasses = variant === 'outline'
    ? 'bg-transparent border border-black-300 text-black'
    : 'badge';

  return <span className={`${variantClasses} ${className}`}>{children}</span>;
}
