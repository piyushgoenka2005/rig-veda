import React from 'react';

// Site-wide fixed background video with dark overlay
const BackgroundVideo: React.FC = () => {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
      <video
        className="absolute inset-0 w-full h-full object-cover object-center"
        src="/Video_Generation_Complete.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Global darkening layer for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-vedic-deep/92 via-vedic-deep/88 to-vedic-deep/85" />
    </div>
  );
};

export default BackgroundVideo;


