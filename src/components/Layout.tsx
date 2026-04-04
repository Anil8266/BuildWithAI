import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  useGrid?: boolean;
}

/**
 * Standard container enforcing the 12/8/4 grid system and responsive context.
 */
export const Container = ({ children, className = '', useGrid = true }: ContainerProps) => {
  return (
    <div className={`app-container ${useGrid ? 'app-grid' : ''} ${className}`}>
      {children}
    </div>
  );
};

interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  span?: {
    mobile?: number; // 1-4
    tablet?: number; // 1-8
    desktop?: number; // 1-12
  };
}

export const GridItem = ({ children, className = '', span }: GridItemProps) => {
  const getSpanChars = () => {
    if (!span) return '';
    const m = span.mobile ? `col-span-${span.mobile}` : '';
    const t = span.tablet ? `md:col-span-${span.tablet}` : '';
    const d = span.desktop ? `lg:col-span-${span.desktop}` : '';
    return `${m} ${t} ${d}`;
  };

  return (
    <div className={`${getSpanChars()} ${className}`}>
      {children}
    </div>
  );
};
