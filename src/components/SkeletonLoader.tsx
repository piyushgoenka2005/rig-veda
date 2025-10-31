import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  variant?: 'text' | 'card' | 'circle' | 'rectangular';
  width?: string;
  height?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  count = 1,
  variant = 'rectangular',
  width,
  height
}) => {
  const baseClasses = 'skeleton';
  
  const variantClasses = {
    text: 'h-4 rounded',
    card: 'h-48 rounded-xl',
    circle: 'rounded-full',
    rectangular: 'rounded'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height || variantClasses[variant].includes('h-') ? undefined : '100%';

  if (variant === 'circle' && !height) {
    style.height = width || '48px';
  }

  if (count === 1) {
    return (
      <div
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        style={style}
        aria-label="Loading..."
      />
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
          style={style}
          aria-label="Loading..."
        />
      ))}
    </>
  );
};

export default SkeletonLoader;

