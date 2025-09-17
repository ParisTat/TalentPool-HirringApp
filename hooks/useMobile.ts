import { useState, useEffect } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isCapacitor, setIsCapacitor] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;
      
      // Check if it's a mobile device
      setIsMobile(width <= 768 || /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent));
      
      // Check if running in Capacitor
      setIsCapacitor(window.Capacitor !== undefined);
      
      // Check platform
      setIsAndroid(userAgent.includes('android'));
      setIsIOS(/iphone|ipad|ipod/i.test(userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { 
    isMobile, 
    isCapacitor, 
    isAndroid, 
    isIOS,
    platform: isCapacitor ? (isAndroid ? 'android' : isIOS ? 'ios' : 'web') : 'web'
  };
};

// Hook for touch interactions
export const useTouch = () => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    return { isLeftSwipe, isRightSwipe, distance };
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};
