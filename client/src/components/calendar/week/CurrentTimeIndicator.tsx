import React, { useEffect, useState } from 'react';

interface CurrentTimeIndicatorProps {
  isToday: boolean;
}

const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ isToday }) => {
  const [top, setTop] = useState(0);
  
  useEffect(() => {
    const calculatePosition = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      setTop(minutes);
    };
    
    calculatePosition();
    
    // Update position every minute
    const interval = setInterval(calculatePosition, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!isToday) return null;
  
  return (
    <>
      <div 
        className="current-time-indicator" 
        style={{ top: `${top}px` }}
      />
      <div 
        className="current-time-circle" 
        style={{ top: `${top}px` }}
      />
    </>
  );
};

export default CurrentTimeIndicator;
