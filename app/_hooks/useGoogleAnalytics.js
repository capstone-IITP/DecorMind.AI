'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

export const GA_MEASUREMENT_ID = 'G-PZFSZDJ84L';

export const pageview = (url) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Define event as a function that can be called directly
export const eventFunc = ({ action, category, label, value }) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Inner component that uses useSearchParams
function GoogleAnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      pageview(url);
    }
  }, [pathname, searchParams]);

  return { 
    pageview, 
    // Return event as a function that can be called directly
    event: eventFunc 
  };
}

// Wrapper with Suspense
function GoogleAnalyticsWrapper() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsContent />
    </Suspense>
  );
}

export default function useGoogleAnalytics() {
  // Since we can't use hooks conditionally, we need a different approach
  // Return event as a function
  return { 
    pageview, 
    event: eventFunc 
  };
}