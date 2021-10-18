import { useEffect, useState } from 'react';

export const useLoadingText = (texts, stop) => {

  const [currentIndex, setCurrentIndex] = useState('');
  
  useEffect(() => {
    let interval;
    if (stop === true) {
      interval = setInterval(() => {
        setCurrentIndex(c => (c + 1) % texts.length)
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    }
  }, [stop])
  
  return texts[currentIndex];
}