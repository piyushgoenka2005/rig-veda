import React from 'react';

interface SectionOverlayProps {
  opacity?: number; // 0 - 100 for Tailwind style e.g., 45 -> bg-black/45
  blur?: 'none' | 'sm' | 'md';
  className?: string;
}

// Reusable absolute overlay to improve readability over video backgrounds
const SectionOverlay: React.FC<SectionOverlayProps> = ({ opacity = 45, blur = 'none', className }) => {
  const blurClass = blur === 'sm' ? 'backdrop-blur-sm' : blur === 'md' ? 'backdrop-blur' : '';
  // Clamp between 0 and 100
  const clamped = Math.max(0, Math.min(100, opacity));
  return (
    <div className={`absolute inset-0 bg-black/${clamped} ${blurClass} ${className || ''}`.trim()} />
  );
};

export default SectionOverlay;


