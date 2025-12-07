import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ message = "Loading...", fullscreen = false }) => {
  // Base classes for centering
  const baseClasses = "flex flex-col justify-center items-center w-full bg-monke-bg text-monke-main z-50";
  
  // Height: Full screen vs Full parent height
  const heightClass = fullscreen ? "fixed inset-0 h-screen" : "h-[60vh] min-h-[300px]";

  return (
    <div className={`${baseClasses} ${heightClass}`}>
      <Loader2 size={64} className="animate-spin mb-6 opacity-80" />
      <div className="font-mono text-xl animate-pulse tracking-widest uppercase opacity-60">
        {message}
      </div>
    </div>
  );
};

export default LoadingScreen;