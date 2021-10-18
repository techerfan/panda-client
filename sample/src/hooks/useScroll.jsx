import { useEffect, useState } from "react"

export const useScroll = (element) => {

  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    element.current.scrollTop = element.current.scrollHeight;
  }, [scroll, element]);

  return () => {
    setScroll(s => !s);
  };
}