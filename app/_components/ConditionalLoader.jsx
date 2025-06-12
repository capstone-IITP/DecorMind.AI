'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConditionalLoader({ children }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Check if loader should be shown based on the current path
    const shouldShowOnPath = pathname === '/' || pathname === '/dashboard';
    
    if (shouldShowOnPath) {
      // Check if the loader has been shown before for this specific path
      const loaderShownKey = `loader_shown_${pathname}`;
      const hasLoaderBeenShown = localStorage.getItem(loaderShownKey);
      
      if (!hasLoaderBeenShown) {
        // If loader hasn't been shown yet for this path, show it and set the flag
        setShowLoader(true);
        localStorage.setItem(loaderShownKey, 'true');
        
        // Hide loader after animation completes
        setTimeout(() => {
          const loader = document.querySelector('#loader');
          if (loader) {
            loader.style.top = '-100%';
          }
        }, 4000);
      }
    }
  }, [pathname]);
  
  return (
    <>
      <div id="loader" className={!showLoader ? "hidden-loader" : ""} suppressHydrationWarning>
        <h1 suppressHydrationWarning>Welcome</h1>
        <h1 suppressHydrationWarning>To</h1>
        <h1 suppressHydrationWarning>DecorMind</h1>
      </div>
      {children}
    </>
  );
} 